const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");

const getLogin = (req, res) => {
  const rememberEmail = req.cookies.rememberEmail;
  const rememberPassword = req.cookies.rememberPassword;
  res.render("admin/login", { data: {}, rememberEmail, rememberPassword });
};

const postLogin = async (req, res) => {
  let { email, password, remember } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    const error = "Tài khoản không tồn tại!";
    return res.render("admin/login", { data: { error } });
  }
  const isPasswordMatch=await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    const error = "Mật khẩu không đúng!";
    return res.render("admin/login", { data: { error } });
  }
    req.session.email = email;
    req.session.password = password;
    if (remember === "true") {
      // Set cookie for email if "remember" is checked
      const hashedPassword = await bcrypt.hash(password, 10);
      res.cookie("rememberEmail", email, { maxAge: 7 * 24 * 60 * 60 * 1000 }); // Expires in 7 days
      res.cookie("rememberPassword", hashedPassword, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }); // Expires in 7 days
    } else {
      // Clear cookie if "remember" is unchecked
      res.clearCookie("rememberEmail");
      res.clearCookie("rememberPassword");
    }
    if (user.role === "member") {
      return res.redirect("/");
    } else {
      return res.redirect("/admin/dashboard");
    }
};

const getRegister = async (req, res) => {
  res.render("admin/register", { data: {} });
};
const store = async (req, res) => {
  const { full_name, email, role, password, re_password } = req.body;
  let error = null;
  const checkUser = await UserModel.findOne({ email });
  if (checkUser) {
    error = "Email đã tồn tại!";
    return res.render("admin/register", { data: { error } });
  } else if (password !== re_password) {
    error = "Mật khẩu không khớp!";
    return res.render("admin/register", { data: { error } });
  }
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  const user = {
    email: email,
    password: hashed,
    role: role,
    full_name: full_name,
    re_password: re_password,
  };
  await new UserModel(user).save();
  res.redirect("/admin/success");
};
const success = async (req, res) => {
  res.render("admin/success");
};
const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/admin/login");
};
module.exports = {
  getLogin,
  postLogin,
  getRegister,
  store,
  success,
  logout,
};
