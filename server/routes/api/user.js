const express = require("express");
const { User } = require("../../Model/MogonDB");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const key = process.env.jwtSecretKey;
const router = express.Router();
const transporter = require("../../Mail/email");

/* 
  Register
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

        let lastLogin = new Date().toLocaleString("zh-cn");
        user.lastLogin = lastLogin;
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

router.post("/forgot", async (req, res, next) => {
  const userEmail = req.body.email;
  await User.findOne({ email: userEmail })
  .then((user) => {
    const VerificationCode = Math.floor(100000 + Math.random() * 900000);
    user.forgotCode = VerificationCode
    user.save();
    // console.log(user);
    const sendmain = async () => {
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
    }
    //console.log("Message sent: %s", info.messageId);
    sendmain().catch(console.error);
  })
  .catch(err => {
    // console.log(err);
    res.status(400).json({
      status: "error",
      msg: "Email address does not exist.",
    });
    return;
  });

})

/*
  Reset password
*/
router.get("/verifycode", async (req, res) => {
  let forgotCode = req.body.forgotCode;
  console.log(forgotCode);
  try {
    // findOne -> email,forgotCode

    //if exist

    
  } catch(err) {
    //if doesn't exist
    console.log(err);
  }
})

router.get("/changepassword", async (req, res) => {
  //eamil, password
  try {
    // findOne -> email

    //if exist

    //bcrypt password

    //if done, res.json

    
  } catch(err) {
    //if doesn't exist
    console.log(err);
  }
})

module.exports = router;
