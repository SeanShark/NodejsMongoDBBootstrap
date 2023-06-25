const express = require("express");
const { User } = require("../../Model/MogonDB");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const key = process.env.jwtSecretKey;
const router = express.Router();
const transporter = require("../../Mail/email");
const svgCaptcha = require('svg-captcha');


router.get("/captcha", async ( req, res) => {
  var captcha = svgCaptcha.create({
    size: 4,
    ignoreChars: '0o1ilIgqp',
    noise: 2,
    color: true,
    background: '#cc9966',
    height: 40,
    width: 160,
  });

  res.type('svg');
  res.set('Captcha', captcha.text);
  res.set("CharacterEncoding","UTF-8");
  res.set("ContentType","application/json");
	res.status(200).send(captcha);
})


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
router.post("/signup", async (req, res, next) => {

  const emailSchema = Joi.object({
    email: Joi.string().email().required(),
  });
  const emailCheck = emailSchema.validate(req.body);
  if (emailCheck.error) {
    res.status(400).json({
      status: "error",
      msg: emailCheck.error.details[0].message,
    });
    return;
  }

  const userEmail = req.body.email;
  const activationCode = Math.floor(100000 + Math.random() * 900000);

  await User.findOne({ email: userEmail })
  .then(async (user) => {
    if(!user) {
      const newUser = new User({
        email: userEmail,
        activationCode: activationCode,
      });
      await newUser.save();
    } else if (user.activationCode === null) {
      res.status(401).json({
        status: "error",
        msg: "邮箱已经被注册，请使用其他邮箱。",
      })
      return
    } else {
      user.activationCode = activationCode
      user.save()
    }

    await transporter
    .sendMail({
      from: "replytech@qq.com",
      to: userEmail,
      subject: "注册验证码",
      //html: `<a href="http://10.168.3.3:5000/api/user/reset/${userEmail}/${VerificationCode}"><b>点击进入重置页面</b></a>`,
      html: `注册的验证码为：${activationCode}`,
    })
    .then((info) => {
      res.status(200).json({
        status: "success",
        msg: '已发送验证码到您邮箱，请查收.',
      });
    })
    .catch((err) => {
      res.status(401).json({
        status: "error",
        msg: "连接超时，请重试。",
      });
    });
  })
  .catch(() => {
    res.status(401).json({
      status: "error",
      msg: "错误，请重试",
    });
  });
});

//Step two: Check email and register code, if ture, send 200 to client; if false, send 401
router.post("/verifysignup", async (req, res) => {
  const email = req.body.email;
  const activationCode = req.body.code;
  try {
    await User.findOne({
      $and: [{ email: email }, { activationCode: activationCode }],
    }).then((user) => {
      if (user) {
        res.status(200).json({
          status: "success",
          msg: "验证通过，请设置密码.",
        });
        return
      } else {
        res.status(401).json({
          status: "error",
          msg: "邮箱或验证码错误，请检查后重试",
        });
        return
      }
    });
  } catch (err) {
    //if doesn't exist
    res.status(401).json({
      status: "error",
      msg: "错误，请检查后重试",
    });
  }
});

//Step three: Check email and register code, if ture ,save bcrypt password, set registerCode to null and send status 200
router.post("/setpassword", async (req, res) => {
  let email = req.body.email;
  let activationCode = req.body.code;
  let password = req.body.password;

  await User.findOne({
    $and: [{ email: email }, { activationCode: activationCode }],
  })
    .then((user) => {
      if (user) {
        user.password = bcrypt.hashSync(password, 10);
        user.activationCode = null;
        user.createdAt = new Date().toLocaleString("zh-cn");;
        user.save();

        res.status(201).json({
          status: "success",
          msg: "密码设置成功，请前往登录页登录系统.",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(401).json({
        status: "error",
        msg: "有错误发生，请重试.",
      });
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
          msg: "没有此用户.",
        });
      }

      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(401).json({
          status: "error",
          msg: "密码错误.",
        });
      }

      const token = jwt.sign({ userID: user._id }, key);

      res.status(200).json({
        status: "success",
        msg: "验证成功",
        token: token,
      });
    })
    .catch((err) => console.log(err));
});

/*
  Verify user
*/

router.get("/verifyuser", async (req, res, next) => {
  let token = req.headers.token;

  jwt.verify(token, key, async (err, decoded) => {
    if (err)
      return res.status(401).json({
        title: "error",
        msg: "未授权用户",
      });
    await User.findOne({ _id: decoded.userID })
      .then((user) => {
        user.lastLogin = new Date();
        user.save();

        return res.status(200).json({
          user: {
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
          },
        });
      })
      .catch((err) => console.log('verifyuser', err));
  });
});

/*
  Forgot password
*/

//Step One: Check email and send forgot code via email, save code in db
router.post("/forgot", async (req, res, next) => {
  const userEmail = req.body.email;
  await User.findOne({ email: userEmail })
    .then(async (user) => {
      const VerificationCode = Math.floor(100000 + Math.random() * 900000);
      user.forgotCode = VerificationCode;
      user.save();
      // console.log(user);

      await transporter
        .sendMail({
          from: "replytech@qq.com",
          to: userEmail,
          subject: "重置验证码",
          text: "Hello world?",
          //html: `<a href="http://10.168.3.3:5000/api/user/reset/${userEmail}/${VerificationCode}"><b>点击进入重置页面</b></a>`,
          html: `此次重置密码的重置码为：${VerificationCode}`,
        })
        .then((info) => {
          res.status(200).json({
            status: "success",
            msg: "验证码已发到您邮箱，请查收",
          });
        })
        .catch((err) => {
          res.status(401).json({
            status: "error",
            msg: "发送邮件失败，请重试.",
          });
        });
    })
    .catch((err) => {
      // console.log(err);
      res.status(401).json({
        status: "error",
        msg: "该邮箱账户不存在.",
      });
      return;
    });
});

//Step two: Verfify email and forgotCode code, if ture, send 200 to client; if false, send 401
router.post("/verifyforgotcode", async (req, res) => {
  let forgotCode = req.body.code;
  let email = req.body.email;
  try {
    await User.findOne({
      $and: [{ email: email }, { forgotCode: forgotCode }],
    }).then((user) => {
      if (user) {
        res.status(200).json({
          status: "success",
          msg: "验证成功，请重新设置您的密码.",
        });
      } else {
        res.status(401).json({
          status: "error",
          msg: "验证码错误，请重试",
        });
      }
    });
  } catch (err) {
    //if doesn't exist
    res.status(401).json({
      status: "error",
      msg: "错误，请重试",
    });
  }
});

//Step three: Verify email and forgot code, if ture ,save bcrypt new password, delete forgot code and send status 200
router.post("/resetpassword", async (req, res) => {
  let email = req.body.email;
  let forgotCode = req.body.code;
  let password = req.body.password;

  await User.findOne({
    $and: [{ email: email }, { forgotCode: forgotCode }],
  })
    .then((user) => {
      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({
            status: "error",
            msg: "密码与前密码一致.",
          });
        }

        user.password = bcrypt.hashSync(password, 10);
        user.forgotCode = "";
        user.save()
          .then(() => {
            res.status(201).json({
              status: "success",
              msg: "密码重置成功，请到登录页进行登录.",
            });
          })
          .catch(err => console.log(err))

      } else {
        res.status(401).json({
          status: "success",
          msg: "验证错误，请重试.",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(401).json({
        status: "error",
        msg: "有错误发生，请重试.",
      });
    });
});

module.exports = router;
