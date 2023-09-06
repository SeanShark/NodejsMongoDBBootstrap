const DataBase = require("../Model/MogonDB");

const validateUser = async (user) => {
  if (!user || user.length > 320) {
    return false;
  } 
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(user)) {
    return false;
  }
  const isAuthUser = await DataBase.User.exists({
    email: user,
  });
  if (!isAuthUser) {
    return false;
  }
  return true;
}
module.exports = validateUser;