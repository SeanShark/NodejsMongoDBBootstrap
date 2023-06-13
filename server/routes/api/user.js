const express = require("express");
const { User } = require("../../Model/MogonDB");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const key = process.env.jwtSecretKey;
const router = express.Router();
const transporter = require("../../Mail/email");

/* 
  Register For Bootstrp
*/
router.post("/register", async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(6)
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    repeat_password: Joi.any().valid(Joi.ref("password")).required(),
  });

  const checkuser = schema.validate(req.body);

  if (checkuser.error) {
    res.status(400).json({
      status: "error",
      msg: checkuser.error.details[0].message,
    });
    return;
  }

  await User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      res.status(400).json({
        status: "error",
        msg: "Email address has already being registered.",
      });
      return;
    }

    const newUser = new User({
      name: req.body.email.match(/(.*)@(.*)/)[1],
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      createdAt: new Date(),
    });

    newUser
      .save()
      .then(
        res.status(200).json({
          status: "success",
          msg: "Now you are successfully register.",
        })
      )
      .catch((err) => console.log(err));
  });
});

/* 
  Register For Quasar
*/
//Step One: Check email and send register code, save code in db

//Step two: Check email and register code, if ture, send 200 to client; if false, send 401

//Step three: Check email and register code, if ture ,save bcrypt password, delete register code and send status 200



/* 
  Login
*/
router.post("/login", async (req, res, next) => {
  
  await User.findOne({ email: req.body.email })
  .then((user) => {
    if (!user) {
      return res.status(401).json({
        status: "error",
        msg: "No such user.",
      });
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json({
        status: "error",
        msg: "Password incorrect.",
      });
    }

    const token = jwt.sign({ userID: user._id }, key);
    


    return res.status(200).json({
      status: "success",
      msg: "Login successfully!",
      token: token
    });
    
  })
  .catch((err) => console.log(err));
});

/*
  Verify user
*/

router.get("/verifyuser", async (req, res, next) => {
  let token = req.headers.token;

  if( token === 'null' ) {
    return res.status(401).json({
      title: "error",
      msg: "Login please.",
    });
  }

  jwt.verify(token, key, async (err, decoded) => {
    if (err)
      return res.status(401).json({
        title: "error",
        msg: "Unauthorized user",
      });

    await User.findOne({ _id: decoded.userID })
      .then((user) => {

        user.lastLogin = new Date().toLocaleString("zh-cn");
        user.save();

        return res.status(200).json({
          title: "success",
          user: {
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
          },
        });
      })
      .catch((err) => console.log(err));
    });
});

/*
  Forgot password
*/

//Step One: Check email and send forgot code via email, save code in db
router.post("/forgot", async (req, res, next) => {
  const userEmail = req.body.email;
  await User.findOne({ email: userEmail })
  .then( async (user) => {
    const VerificationCode = Math.floor(100000 + Math.random() * 900000);
    user.forgotCode = VerificationCode
    user.save();
    // console.log(user);
    
    await transporter.sendMail({
      from: "replytech@qq.com",
      to: userEmail, 
      subject: "Reset Password", 
      text: "Hello world?", 
      //html: `<a href="http://10.168.3.3:5000/api/user/reset/${userEmail}/${VerificationCode}"><b>点击进入重置页面</b></a>`, 
      html: `此次重置密码的重置码为：${VerificationCode}`, 
    })
    .then(info => {
      res.status(200).json({
        status: "success",
        msg: info.messageId,
      });
    })
    .catch(err => {
      res.status(401).json({
        status: "error",
        msg: "Connection timed out, Please try again.",
      });
    })
  })
  .catch(err => {
    // console.log(err);
    res.status(401).json({
      status: "error",
      msg: "Email address does not exist.",
    });
    return;
  });

})


//Step two: Check email and forgotCode code, if ture, send 200 to client; if false, send 401
router.post("/verifycode", async (req, res) => {
  let forgotCode = req.body.forgotCode;
  let email = req.body.email;
  try {
    await User.findOne({
      $and: [
        { email: email },
        { forgotCode: forgotCode}
      ]
    })
    .then((user) => {
      if(user) {
        res.status(200).json({
          status: "success",
          msg: 'Please reset your password.',
        });
      }
    })
  } catch(err) {
    //if doesn't exist
    res.status(401).json({
      status: "error",
      msg: 'User or Code error, Please try again',
    });
  }
})

//Step three: Check email and forgot code, if ture ,save bcrypt new password, delete forgot code and send status 200
router.post("/resetpassword", async (req, res) => {
  let email = req.body.email;
  let forgotCode = req.body.forgotCode;
  let password = req.body.password;

  await User.findOne({
    $and: [
      { email: email },
      { forgotCode: forgotCode}
    ]
  })
  .then((user) => {
    if(user) {
      user.password = bcrypt.hashSync( password, 10 );
      user.forgotCode = "";
      user.save();

      res.status(201).json({
        status: "success",
        msg: 'Password changed successfully.',
      });
    }
  })
  .catch((err) => {
    console.log(err);
    res.status(401).json({
      status: "error",
      msg: 'Error occur, please try again.',
    });
  })

})

module.exports = router;
