const { boolean } = require("joi");
const mongoose = require("mongoose");
const dbURL = process.env.mongoDBURL;

mongoose.set("strictQuery", false);
mongoose
  .connect(dbURL)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));


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
  }
});

const IpMacSchema = new mongoose.Schema({
  姓名: {
    type: String,
    required: true,
  },
  所属: {
    type: String,
    required: true,
  },
  MAC: {
    type: String,
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
  }
});

const Posts = mongoose.models.posts || mongoose.model("posts", postsSchema);
const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Ipmac = mongoose.models.ipmacs || mongoose.model("Ipmac", IpMacSchema);

module.exports = {
  Posts,
  User,
  Ipmac
};