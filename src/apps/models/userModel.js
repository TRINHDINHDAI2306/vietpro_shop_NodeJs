const mongoose = require("../../common/database")();
const userSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "member",
  },
});
const UserModel = mongoose.model("Users", userSchema, "users");
module.exports = UserModel;
