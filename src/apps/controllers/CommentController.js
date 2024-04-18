const ProductModel = require("../models/productModel");
const pagination = require("../../common/pagination");
const CommentModel = require("../models/commentModel");
const moment = require("moment");
const index = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const count = 1;
  const limit = 10;
  const skip = page * limit - limit;
  const comments = await CommentModel.find()
    .populate({ path: "prd_id" })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);
  const totalRows = await CommentModel.find().countDocuments();
  const totalPages = Math.ceil(totalRows / limit);
  res.render("admin/comments/comment", {
    comments,
    count,
    moment,
    pages: pagination(page, limit, totalRows),
    page,
    totalPages,
  });
};

const edit = async (req, res) => {
  const { id } = req.params;
  const products = await ProductModel.find().sort({ _id: 1 });
  const comment = await CommentModel.findById({ _id: id });
  res.render("admin/comments/edit_comment", { comment, products });
};
const approve = async (req, res) => {
  const { id } = req.params;
  const comment = await CommentModel.findById({ _id: id });
  const approveComment = {
    role: !comment.role 
  }
    await CommentModel.updateOne({_id: id}, {$set: approveComment })
  res.redirect('/admin/comments')
};
const update = async (req, res) => {
  const { id } = req.params;
  const { full_name, email, body, prd_id } = req.body;
  const updateComment = {
    full_name,
    email,
    body,
    prd_id,
  };
  await CommentModel.findByIdAndUpdate(id, updateComment);
  res.redirect("/admin/comments");
};
const del = async (req, res) => {
  const { id } = req.params;
  await CommentModel.deleteOne({ _id: id });
  res.redirect("/admin/comments");
};
const delSelected = async (req, res) => {
  const id = req.body.selectedComments;
  await CommentModel.deleteMany({ _id: {$in: id} });
  res.redirect("/admin/comments");
};
module.exports = {
  index,
  edit,
  update,
  approve,
  del,
  delSelected,
};
