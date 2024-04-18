const CategoryModel = require("../models/categoryModel");
const UserModel = require("../models/userModel");
const pagination = require("../../common/pagination");
const index = async (req, res) => {
  const count =1;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = page * limit - limit;
  const users = await UserModel.find().sort({ _id: 1 }).skip(skip).limit(limit);
  const totalRows = await UserModel.find().countDocuments();
  const totalPages = Math.ceil(totalRows / limit);
  res.render("admin/users/user", {
    users,
    count,
    pages: pagination(page, limit, totalRows),
    page,
    totalPages,
  });
};
const create = async (req, res) => {
  res.render("admin/users/add_user", { data: {} });
};
const store = async (req, res) => {
  const { full_name, email, password, re_password, role } = req.body;
  let error = null;
  const checkUser = await UserModel.findOne({ email });
  if (checkUser) {
    error = "Email đã tồn tại!";
    return res.render("admin/users/add_user", { data: { error } });
  } else if (password !== re_password) {
    error = "Mật khẩu không khớp!";
    return res.render("admin/users/add_user", { data: { error } });
  }
  const user = {
    email: email,
    password: password,
    role: role == "admin",
    full_name: full_name,
    re_password: re_password,
  };
  await new UserModel(user).save();
  res.redirect("/admin/users");
};

const edit = async (req, res) => {
  const id = req.params.id;
  const user = await UserModel.findById({ _id: id });
  res.render("admin/users/edit_user", { data: {}, user });
};
const update = async (req, res) => {
  const id = req.params.id;
  const user = await UserModel.findById({ _id: id });
  const { email, password, re_password, full_name, role } = req.body;
  let error = null;
  const updateUser = {
    email: email,
    password: password,
    role: role == "admin",
    full_name: full_name,
  };
  const checkUser = await UserModel.findOne({ _id: { $ne: id }, email });
  console.log(checkUser);
  if (checkUser) {
    error = "Email đã tồn tại!";
    return res.render("admin/users/edit_user", { data: { error }, user });
  } else if (password !== re_password) {
    error = "Mật khẩu không khớp!";
    return res.render("admin/users/edit_user", { data: { error }, user });
  }
  await UserModel.updateOne({ _id: id }, { $set: updateUser });
  res.redirect("/admin/users");
};
const del = async (req, res) => {
  const { id } = req.params;
  await UserModel.deleteOne({ _id: id });
  res.redirect("/admin/users");
};
const delSelected = async (req, res) => {
  const id = req.body.selectedUsers;
  await UserModel.deleteMany({ _id: { $in: id } });
  res.redirect("/admin/users");
};
module.exports = {
  index,
  create,
  store,
  edit,
  update,
  del,
  delSelected,
};
