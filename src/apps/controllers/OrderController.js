const OrderModel = require("../models/orderModel");
const ProductModel = require("../models/productModel");
const pagination = require("../../common/pagination");

const path = require("path");
const slug = require("slug");
const fs = require("fs");
const index = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = page * limit - limit;
  const orders = await OrderModel.find()
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);
  const totalRows = await OrderModel.find().countDocuments();
  const totalPages = Math.ceil(totalRows / limit);
  res.render("admin/orders/order", {
    orders,
    pages: pagination(page, limit, totalRows),
    page,
    totalPages,
  });
};
const del = async (req, res) => {
  const { id } = req.params;
  await OrderModel.deleteOne({ _id: id });
  res.redirect("/admin/orders");
};
module.exports = {
  index,
  del,
};
