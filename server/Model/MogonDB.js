
const mongoose = require("mongoose");
const dbURL = process.env.mongoDBURL;

mongoose.set("strictQuery", false);
mongoose
  .connect(dbURL)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

  const todoSchema = new mongoose.Schema({
    owner: {
      type: String,
      required: true,
    },
    todo: {
      type: String,
      required: true,
    },
    createdAt: {
      type: String,
      required: true,
      // timezone: 'Asia/Shanghai' // set timezone to EST
    },
    color: {
      type: String,
      default: "black",
    },
    isDone: {
      type: Boolean,
      default: false,
    },
  });


const postsSchema = new mongoose.Schema({
    post: {
      type: String,
      required: true,
    },
    createdAt: {
      type: String,
      //default: new Date().toLocaleString("zh-cn")
      required: true,
      // timezone: 'Asia/Shanghai' // set timezone to EST
    }
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
  },
  forgotCode: {
    type: String,
    default: null,
  },
  activationCode: {
    type: String,
    default: null,
  },
  createdAt: {
    type: String
    //default: Date().toLocaleString("zh-cn")
  },
  lastLogin: {
    type: String
  },
  loggerSetting: {
    monthRange: {
      type: Number,
      default: 1
    },
    eventColor: {
      type: String,
      default: 'orange'
    },
    themeColor: {
      type: String,
      default: 'primary'
    },
  }
});

const IPSchema = new mongoose.Schema({
  Place: {
    type: String,
    required: true,
  },
  姓名: {
    type: String,
    required: true,
  },
  MAC: {
    type: String,
    required: true,
    uppercase: true,
  },
  IP: {
    type: String,
    required: true,
  },
  办公室: {
    type: String,
    default: null
  },
  备注: {
    type: String,
    default: null
  },
  updatedAt: {
    type: String,
  }
});


const PrinterSchema = new mongoose.Schema({
  Place: {
    type: String,
    required: true,
  },
  品牌: {
    type: String,
    required: true,
  },
  硒鼓: {
    type: String,
    required: true,
    uppercase: true,
  },
  颜色: {
    type: String,
    required: true,
    default: '黑色'
  },
  数量:{
    type: Number,
    min: 0,
    default: 0
  },
  打印机: {
    type: String,
    uppercase: true,
    required: true,
  },
  办公室: {
    type: String,
    default: null
  },
  updatedAt: {
    type: String,
  }
});

const PhoneSchema = new mongoose.Schema({
  号码: {
    type: String,
    required: true,
  },
  面板号: {
    type: String,
  },
  楼层线路: {
    type: String,
    uppercase: true,
  },
  颜色对: {
    type: String,
  },
  办公室:{
    type: String,
    required: true,
  },
  Place: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: String,
  }
});

const DataCenterSchema = new mongoose.Schema({
  名称: {
    type: String,
    required: true,
  },
  IP: {
    type: String,
    required: true,
  },
  用户名: {
    type: String,
    required: true,
  },
  密码: {
    type: String,
  },
  备注:{
    type: String,
  },
  Place: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: String,
  }
});
const SurveillanceSchema = new mongoose.Schema({
  Place: {
    type: String,
    required: true,
  },
  类型: {
    type: String,
    required: true,
  },
  IP: {
    type: String,
    required: true,
  },
  用户名: {
    type: String,
    required: true,
  },
  密码: {
    type: String,
    required: true,
  },
  备注:{
    type: String,
  },
  updatedAt: {
    type: String,
  }
});
const LoggerSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  logger: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  }
});


const Posts = mongoose.models.posts || mongoose.model("posts", postsSchema);
const User = mongoose.models.User || mongoose.model("User", UserSchema);
const IP = mongoose.models.ipmacs || mongoose.model("Ipmac", IPSchema);
const Todo = mongoose.models.todo || mongoose.model("Todo", todoSchema);
const Printer = mongoose.models.printer || mongoose.model("Printer", PrinterSchema);
const Phone = mongoose.models.phone || mongoose.model("Phone", PhoneSchema);
const DataCenter = mongoose.models.datacenter || mongoose.model("DataCenter", DataCenterSchema);
const Surveillance = mongoose.models.surveillance || mongoose.model("Surveillance", SurveillanceSchema);
const Logger = mongoose.models.logger || mongoose.model("Logger", LoggerSchema);

module.exports = {
  Posts,
  User,
  IP,
  Todo,
  Printer,
  Phone,
  DataCenter,
  Surveillance,
  Logger,
};