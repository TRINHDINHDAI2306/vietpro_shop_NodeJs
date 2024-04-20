const UserModel = require("../models/userModel");
const ProductModel = require("../models/productModel");
const CommentModel = require("../models/commentModel");
const index = async (req, res) => {
  const total_product = await ProductModel.find().countDocuments();
  const total_user = await UserModel.find().countDocuments();
  const total_comment = await CommentModel.find().countDocuments();
  res.render("admin/dashboard", { total_user, total_product, total_comment });
};
module.exports = {
  index,
};