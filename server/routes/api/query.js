const express = require("express");
const {
  IP,
  Printer,
  Phone,
  DataCenter,
  Surveillance,
} = require("../../Model/MogonDB");
const DataBase = require("../../Model/MogonDB");
const router = express.Router();

router.get("/", async (req, res) => {
  if (!req.query.queryData.user) {
    return res.status(401).json({
      status: "Error",
      msg: "未授权用户",
    });
  } else {
    const isAuthUser = DataBase.User.exists({
      email: req.query.queryData.user,
    });
    if (!isAuthUser) {
      return res.status(401).json({
        status: "Error",
        msg: "未授权用户",
      });
    }
  }

  if (
    !req.query.queryData.type ||
    !req.query.queryData.place ||
    !req.query.queryData.field ||
    !req.query.queryData.keyword
  ) {
    return res.status(401).json({
      status: "keywordError",
      msg: "查询参数错误",
    });
  }

  const forbiddenKeyword = ["1.2", "2.1", "1.1", "0.0"];

  let keyword = req.query.queryData.keyword.toUpperCase();
  let isForbidden = false;
  for (const forbidden of forbiddenKeyword) {
    if (keyword === forbidden) {
      isForbidden = true;
      break;
    }
  }
  if (isForbidden) {
    res.status(401).json({
      status: "keywordError",
      msg: "关键字过于简单，请使用其他关键字",
    });
    return;
  }

  const type = req.query.queryData.type;
  const place = req.query.queryData.place;

  let DB = new Object();

  if (type === "机房") {
    DB = DataBase.DataCenter;
  } else if (type === "终端") {
    DB = DataBase.IP;
  } else if (type === "耗材") {
    DB = DataBase.Printer;
  } else if (type === "电话") {
    DB = DataBase.Phone;
  } else if (type === "监控") {
    DB = DataBase.Surveillance;
  } else {
    res.status(401).json({
      status: "error",
      msg: "错误搜索类型",
    });
    return;
  }

  if (keyword === "全部" || keyword === "所有" || keyword === "ALL") {
    await DB.find({ Place: place })
      .sort({ updatedAt: "descending" })
      .then((results) => {
        res.status(201).send(results);
      })
      .catch((err) => console.log(err));
  } else {
    await DB.find({
      $and: [
        { Place: place },
        { [req.query.queryData.field]: { $regex: new RegExp(keyword, "i") } },
      ],
    })
      .sort({ updatedAt: "descending" })
      .then((results) => {
        res.status(201).send(results);
      })
      .catch((err) => console.log(err));
  }
});

router.get("/logger", async (req, res) => {
  if(!req.query.user) {
    return res.status(401).json({
      status: "Error",
      msg: "未授权用户",
    });
  } else {
    const isAuthUser = DataBase.User.exists({
      email: req.query.user,
    });
    if (!isAuthUser) {
      return res.status(401).json({
        status: "Error",
        msg: "未授权用户",
      });
    }
  }

  try {
    const user = req.query.user;
  
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
    const result = await DataBase.Logger.find({
      $and: [
        { user: user },
        { createdAt: { $gte: oneMonthAgo }}
      ]
    });
    
    res.status(201).json(result);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: error.msg });
  }
});

router.post("/addlogger", async (req, res) => {
  if (!req.body.user) {
    return res.status(401).json({
      status: "Error",
      msg: "未授权用户",
    });
  } else {
    const isAuthUser = DataBase.User.exists({
      email: req.body.user,
    });
    if (!isAuthUser) {
      return res.status(401).json({
        status: "Error",
        msg: "未授权用户",
      });
    }
  }

  const logger = req.body.logger;
  const user = req.body.user;
  const date = req.body.date;
  const createdAt = new Date().toLocaleString("zh-cn");

  const loggerExist = await DataBase.Logger.exists({
    $and: [
      { user: user },
      { date: date }
    ],
  });


  if ( loggerExist ) {
    const existingLogger = await DataBase.Logger.findOne({ "_id": loggerExist });
    const updatedLogger = existingLogger.logger + "<ul><li>" + logger + "</li></ul>";

    await DataBase.Logger.updateOne(
      { "_id": loggerExist },
      { $set: { "logger": updatedLogger } },
    );
    res.status(201).json({
      status: "success",
      msg: "日志成功增加.",
      logger: existingLogger.logger,
    });

    // console.log(result.modifiedCount, "document(s) updated");
  }
  else {
    try {
      const newLogger = new DataBase.Logger({
        user: user,
        date: date,
        logger: "<ul><li>" + logger + "</li></ul>",
        createdAt: createdAt,
      });

      // Save new post to database
      await newLogger.save()
      .then((e) => {
        res.status(201).json({
          status: "success",
          msg: "日志成功增加.",
          id: e._id.toString(),
        });
      })
      .catch((err) => {
        return res.status(401).json({
          status: "error",
          msg: err.message,
        });
      })
    }
    catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "error",
        msg: "Internal server error."
      });
    }
  }
})

router.post("/editlogger", async (req, res) => {
  if (!req.body.user) {
    return res.status(401).json({
      status: "Error",
      msg: "未授权用户",
    });
  } else {
    const isAuthUser = DataBase.User.exists({
      email: req.body.user,
    });
    if (!isAuthUser) {
      return res.status(401).json({
        status: "Error",
        msg: "未授权用户",
      });
    }
  }

  try {
    const id = req.body.id;
    const logger = req.body.logger;
    
    const result = await DataBase.Logger.findOneAndUpdate({ _id: id }, { "logger": logger})
    res.status(201).json({
      status: "success",
      msg: "日志成功修改.",
    });
  }
  catch (error) {
    // Handle errors
    console.error(error);
    return res.status(500).json({
      status: "error",
      msg: "Internal server error."
    });
  }
});

router.post("/addip", async (req, res) => {
  let MAC = req.body.MAC.toUpperCase();
  let place = req.body.Place;
  let existsIP = await IP.exists({
    $and: [{ Place: place }, { IP: req.body.IP }],
  });
  let existsMAC = await IP.exists({
    $and: [{ Place: place }, { MAC: MAC }],
  });

  if (existsIP) {
    res.status(401).json({
      status: "ipError",
      msg: "IP地址已存在",
    });
  } else if (existsMAC) {
    res.status(401).json({
      status: "macError",
      msg: "MAC地址已存在",
    });
  } else {
    const date = new Date().toLocaleString("zh-cn");
    const newRecord = new IP({
      Place: place,
      IP: req.body.IP,
      MAC: MAC,
      姓名: req.body.姓名,
      办公室: req.body.办公室,
      备注: req.body.备注,
      updatedAt: date,
    });

    await newRecord
      .save()
      .then((e) => {
        res.status(201).json({
          status: "success",
          msg: "已成功增加记录",
          _id: e._id.toString(),
          updatedAt: date,
        });
      })
      .catch((e) => {
        // console.log(e.message);
        res.status(401).json({
          status: "error",
          msg: e.message,
        });
      });
  }
});

router.post("/adddatacenter", async (req, res) => {
  let place = req.body.Place;
  let ip = req.body.IP;
  let existsIP = await DataCenter.exists({
    $and: [{ Place: place }, { IP: ip }],
  });

  if (existsIP) {
    res.status(401).json({
      status: "ipError",
      msg: "IP地址已存在",
    });
  } else {
    const date = new Date().toLocaleString("zh-cn");
    const newRecord = new DataCenter({
      Place: place,
      IP: ip,
      名称: req.body.名称,
      用户名: req.body.用户名,
      密码: req.body.密码,
      备注: req.body.备注,
      updatedAt: date,
    });

    await newRecord
      .save()
      .then((e) => {
        res.status(201).json({
          status: "success",
          msg: "已成功增加记录",
          _id: e._id.toString(),
          updatedAt: date,
        });
      })
      .catch((e) => {
        // console.log(e.message);
        res.status(401).json({
          status: "error",
          msg: e.message,
        });
      });
  }
});

router.post("/addsurveillance", async (req, res) => {
  let place = req.body.Place;
  let ip = req.body.IP;
  let existsIP = await Surveillance.exists({
    $and: [{ Place: place }, { IP: ip }],
  });

  if (existsIP) {
    return res.status(401).json({
      status: "ipError",
      msg: "IP地址已存在",
    });
  }
  const date = new Date().toLocaleString("zh-cn");
  const newRecord = new Surveillance({
    Place: place,
    类型: req.body.类型,
    IP: ip,
    用户名: req.body.用户名,
    密码: req.body.密码,
    备注: req.body.备注,
    updatedAt: date,
  });

  await newRecord
    .save()
    .then((e) => {
      res.status(201).json({
        status: "success",
        msg: "已成功增加记录",
        _id: e._id.toString(),
        updatedAt: date,
      });
    })
    .catch((e) => {
      // console.log(e.message);
      res.status(401).json({
        status: "error",
        msg: e.message,
      });
    });
});

router.post("/addphone", async (req, res) => {
  if (
    !req.body.Place ||
    !req.body.号码 ||
    !req.body.面板号 ||
    !req.body.办公室
  ) {
    res.status(401).json({
      status: "Error",
      msg: "缺乏关键信息.",
    });
    return;
  }
  const place = req.body.Place;
  const cable = req.body.楼层线路.toUpperCase();
  const number = req.body.号码;

  if (number < 10000000 || number > 100000000) {
    res.status(401).json({
      status: "numberError",
      msg: "请输入有效号码.",
    });
    return;
  }
  let existsNumber = await Phone.exists({
    $and: [{ Place: place }, { 号码: number }],
  });

  let existsPanel = await Phone.exists({
    $and: [{ Place: place }, { 面板号: req.body.面板号 }],
  });

  let existsColor = await Phone.exists({
    $and: [{ Place: place }, { 楼层线路: cable }, { 颜色对: req.body.颜色对 }],
  });

  if (existsNumber) {
    res.status(401).json({
      status: "numberError",
      msg: "号码已存在",
    });
    return;
  } else if (existsPanel) {
    res.status(401).json({
      status: "panelError",
      msg: "面板号已使用",
    });
    return;
  } else if (existsColor) {
    res.status(401).json({
      status: "colorError",
      msg: "颜色对已使用",
    });
    return;
  } else {
    const date = new Date().toLocaleString("zh-cn");
    const newRecord = new Phone({
      Place: place,
      号码: number,
      面板号: req.body.面板号,
      楼层线路: cable,
      颜色对: req.body.颜色对,
      办公室: req.body.办公室,
      updatedAt: date,
    });

    await newRecord
      .save()
      .then((e) => {
        res.status(201).json({
          status: "success",
          msg: "已成功增加记录",
          _id: e._id.toString(),
          updatedAt: date,
        });
      })
      .catch((e) => {
        res.status(401).json({
          status: "error",
          msg: e.message,
        });
      });
  }
});

router.post("/addprinter", async (req, res) => {
  if (
    !req.body.品牌 ||
    !req.body.打印机 ||
    !req.body.硒鼓 ||
    !req.body.颜色 ||
    !req.body.办公室
  ) {
    return res.status(401).json({
      status: "Error",
      msg: "缺乏关键信息",
    });
  }
  const brand = req.body.品牌;
  const place = req.body.Place;
  const printer = req.body.打印机;
  const cartridge = req.body.硒鼓.toUpperCase();
  const color = req.body.颜色;
  const amount = req.body.数量 ? parseInt(req.body.数量) : 0;
  const office = req.body.办公室;
  const date = new Date().toLocaleString("zh-cn");

  let existsColor = await Printer.exists({
    $and: [
      { Place: place },
      { 品牌: brand },
      { 硒鼓: cartridge },
      { 颜色: color },
    ],
  });

  if (existsColor) {
    return res.status(401).json({
      status: "colorError",
      msg: "颜色已存在",
    });
  }
  const newRecord = new Printer({
    Place: place,
    品牌: brand,
    打印机: printer,
    硒鼓: cartridge,
    颜色: color,
    数量: amount,
    办公室: office,
    updatedAt: date,
  });

  await newRecord
    .save()
    .then((e) => {
      res.status(201).json({
        status: "success",
        msg: "已成功增加记录",
        _id: e._id.toString(),
        updatedAt: date,
      });
    })
    .catch((e) => {
      res.status(401).json({
        status: "error",
        msg: e.message,
      });
    });
});

router.delete("/delete", async (req, res) => {
  const type = req.query.type;
  const id = req.query.id;
  let DB = new Object();

  if (type === "机房") {
    DB = DataBase.DataCenter;
  } else if (type === "终端") {
    DB = DataBase.IP;
  } else if (type === "耗材") {
    DB = DataBase.Printer;
  } else if (type === "电话") {
    DB = DataBase.Phone;
  } else if (type === "监控") {
    DB = DataBase.Surveillance;
  } else {
    res.status(401).json({
      status: "error",
      msg: "错误搜索类型",
    });
    return;
  }

  try {
    await DB.deleteOne({ _id: id })
      .then((e) => {
        res.status(201).json({
          status: "success",
          msg: "记录已成功删除.",
        });
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      status: "error",
      msg: err.message,
    });
  }
});

router.delete("/deletelogger", async (req, res) => {
  const user = req.query.user;
  if (!user) {
    return res.status(401).json({
      status: "Error",
      msg: "未授权用户",
    });
  } else {
    const isAuthUser = DataBase.User.exists({
      email: user,
    });
    if (!isAuthUser) {
      return res.status(401).json({
        status: "Error",
        msg: "未授权用户",
      });
    }
  }

  const id = req.query.id;
  try {
    await DataBase.Logger.deleteOne({ _id: id })
      .then(() => {
        res.status(201).json({
          status: "success",
          msg: "日志已成功删除.",
        });
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      status: "error",
      msg: err.message,
    });
  }
});



router.put("/editip", async (req, res) => {
  const ip = req.body.IP;
  const mac = req.body.MAC.toUpperCase();
  const place = req.body.Place;
  const id = req.body._id;

  let existsIP = await IP.exists({
    $and: [{ IP: ip }, { Place: place }, { _id: { $ne: id } }],
  });
  let existsMAC = await IP.exists({
    $and: [{ MAC: mac }, { Place: place }, { _id: { $ne: id } }],
  });
  if (existsIP) {
    res.status(401).json({
      status: "ipError",
      msg: "与现有IP地址冲突",
    });
    return;
  } else if (existsMAC) {
    res.status(401).json({
      status: "macError",
      msg: "与现有MAC地址冲突",
    });
    return;
  } else {
    const date = new Date().toLocaleString("zh-cn");
    const updateUser = {
      IP: ip,
      MAC: mac,
      姓名: req.body.姓名,
      办公室: req.body.办公室,
      备注: req.body.备注,
      updatedAt: date,
    };
    IP.findOneAndUpdate({ _id: id }, updateUser)
      .then((e) => {
        res.status(201).json({
          status: "success",
          msg: "记录已更新",
          updatedAt: date,
        });
      })
      .catch((err) => {
        return res.status(401).json({
          status: "error",
          msg: err.message,
        });
      });
  }
});

router.put("/editphone", async (req, res) => {
  if (
    !req.body.Place ||
    !req.body.号码 ||
    !req.body.面板号 ||
    !req.body.办公室
  ) {
    res.status(401).json({
      status: "Error",
      msg: "缺乏关键信息.",
    });
    return;
  }
  const place = req.body.Place;
  const cable = req.body.楼层线路.toUpperCase();
  const number = req.body.号码;
  const color = req.body.颜色对;
  const id = req.body._id;

  if (number < 10000000 || number > 100000000) {
    res.status(401).json({
      status: "numberError",
      msg: "请输入有效号码.",
    });
    return;
  }
  let existsPhone = await Phone.exists({
    $and: [{ Place: place }, { 号码: number }, { _id: { $ne: id } }],
  });
  let existsPanel = await Phone.exists({
    $and: [{ Place: place }, { 面板号: req.body.面板号 }, { _id: { $ne: id } }],
  });

  if (req.body.楼层线路) {
    let existsColor = await Phone.exists({
      $and: [
        { Place: place },
        { 楼层线路: cable },
        { 颜色对: color },
        { _id: { $ne: id } },
      ],
    });
    if (existsColor) {
      res.status(401).json({
        status: "colorError",
        msg: "颜色对已使用",
      });
      return;
    }
  }

  if (existsPhone) {
    res.status(401).json({
      status: "numberError",
      msg: "号码已存在",
    });
    return;
  } else if (existsPanel) {
    res.status(401).json({
      status: "panelError",
      msg: "面板号已使用",
    });
    return;
  } else {
    const date = new Date().toLocaleString("zh-cn");
    const updatePhone = {
      号码: req.body.号码,
      面板号: req.body.面板号,
      楼层线路: req.body.楼层线路,
      颜色对: req.body.颜色对,
      办公室: req.body.办公室,
      updatedAt: date,
    };
    Phone.findOneAndUpdate({ _id: req.body._id }, updatePhone)
      .then(() => {
        res.status(201).json({
          status: "success",
          msg: "记录已更新",
          updatedAt: date,
        });
      })
      .catch((err) => {
        return res.status(401).json({
          status: "error",
          msg: err.message,
        });
      });
  }
});

router.put("/editprinter", async (req, res) => {
  if (
    !req.body.品牌 ||
    !req.body.打印机 ||
    !req.body.硒鼓 ||
    !req.body.颜色 ||
    !req.body.办公室
  ) {
    return res.status(401).json({
      status: "Error",
      msg: "缺乏关键信息",
    });
  }
  const id = req.body._id;
  const place = req.body.Place;
  const brand = req.body.品牌;
  const printer = req.body.打印机;
  const cartridge = req.body.硒鼓.toUpperCase();
  const color = req.body.颜色;
  const amount = req.body.数量 ? parseInt(req.body.数量) : 0;
  // console.log(typeof amount); //number
  const office = req.body.办公室;
  const date = new Date().toLocaleString("zh-cn");
  let existsColor = await Printer.exists({
    $and: [
      { Place: place },
      { 硒鼓: cartridge },
      { 颜色: color },
      { _id: { $ne: id } },
    ],
  });

  if (existsColor) {
    return res.status(401).json({
      status: "colorError",
      msg: "颜色已存在",
    });
  }

  const updatePrinter = {
    品牌: brand,
    打印机: printer,
    硒鼓: cartridge,
    颜色: color,
    数量: amount,
    办公室: office,
    updatedAt: date,
  };
  Printer.findOneAndUpdate({ _id: req.body._id }, updatePrinter)
    .then(() => {
      res.status(201).json({
        status: "success",
        msg: "记录已更新",
        updatedAt: date,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        status: "error",
        msg: err.message,
      });
    });
});

router.put("/editdatacenter", async (req, res) => {
  let ip = req.body.IP;
  let existsIP = await DataCenter.exists({
    $and: [
      { Place: req.body.Place },
      { IP: ip },
      { _id: { $ne: req.body._id } },
    ],
  });
  if (existsIP) {
    res.status(401).json({
      status: "ipError",
      msg: "与现有IP地址冲突",
    });
  } else {
    const date = new Date().toLocaleString("zh-cn");
    const updateDataCenter = {
      名称: req.body.名称,
      IP: req.body.IP,
      用户名: req.body.用户名,
      密码: req.body.密码,
      备注: req.body.备注,
      updatedAt: date,
    };
    DataCenter.findOneAndUpdate({ _id: req.body._id }, updateDataCenter)
      .then(() => {
        res.status(201).json({
          status: "success",
          msg: "记录已更新",
          updatedAt: date,
        });
      })
      .catch((err) => {
        return res.status(401).json({
          status: "error",
          msg: err.message,
        });
      });
  }
});

router.put("/editsurveillance", async (req, res) => {
  let ip = req.body.IP;
  let existsIP = await Surveillance.exists({
    $and: [
      { Place: req.body.Place },
      { IP: ip },
      { _id: { $ne: req.body._id } },
    ],
  });
  if (existsIP) {
    res.status(401).json({
      status: "ipError",
      msg: "与现有IP地址冲突",
    });
  } else {
    const date = new Date().toLocaleString("zh-cn");
    const updateDataCenter = {
      类型: req.body.类型,
      IP: ip,
      用户名: req.body.用户名,
      密码: req.body.密码,
      备注: req.body.备注,
      updatedAt: date,
    };
    Surveillance.findOneAndUpdate({ _id: req.body._id }, updateDataCenter)
      .then(() => {
        res.status(201).json({
          status: "success",
          msg: "记录已更新",
          updatedAt: date,
        });
      })
      .catch((err) => {
        return res.status(401).json({
          status: "error",
          msg: err.message,
        });
      });
  }
});

module.exports = router;
