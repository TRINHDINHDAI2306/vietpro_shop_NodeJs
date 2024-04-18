const CategoryModel = require("../models/categoryModel");
const ProductModel = require("../models/productModel");
const pagination = require("../../common/pagination");

const path = require("path");
const slug = require("slug");
const fs = require("fs");
const index = async (req, res) => {
  const count = 1;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = page * limit - limit;
  const products = await ProductModel.find()
    .populate({ path: "cat_id" })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);
  const totalRows = await ProductModel.find().countDocuments();
  const totalPages = Math.ceil(totalRows / limit);
  res.render("admin/products/product", {
    products,
    count,
    pages: pagination(page, limit, totalRows),
    page,
    totalPages,
  });
};
const create = async (req, res) => {
  const categories = await CategoryModel.find().sort({ _id: 1 });
  res.render("admin/products/add_product", { categories });
};
const store = (req, res) => {
  const { body, file } = req;
  const product = {
    description: body.description,
    price: body.price,
    cat_id: body.cat_id,
    status: body.status,
    featured: body.featured == "on",
    promotion: body.promotion,
    warranty: body.warranty,
    accessories: body.accessories,
    is_stock: body.is_stock,
    name: body.name,
    slug: slug(body.name),
    // thumbnail: body.thumbnail,
  };
  if (file) {
    const thumbnail = `products/${file.originalname}`;
    fs.renameSync(
      file.path,
      path.resolve("src/public/uploads/images/", thumbnail)
    );
    product["thumbnail"] = thumbnail;
    new ProductModel(product).save();
    res.redirect("/admin/products");
  }
};
const edit = async (req, res) => {
  const id = req.params.id;
  const categories = await CategoryModel.find().sort({ _id: 1 });
  const product = await ProductModel.findById({ _id: id });
  res.render("admin/products/edit_product", { product, categories });
};

const update = async (req, res) => {
  const id = req.params.id;
  const { body, file } = req;
  const product = {
    description: body.description,
    price: body.price,
    cat_id: body.cat_id,
    status: body.status,
    featured: body.featured == "on",
    promotion: body.promotion,
    warranty: body.warranty,
    accessories: body.accessories,
    is_stock: body.is_stock,
    name: body.name,
    slug: slug(body.name),
  };
  if (file) {
    const thumbnail = `products/${file.originalname}`;
    fs.renameSync(
      file.path,
      path.resolve("src/public/uploads/images/", thumbnail)
    );
    product["thumbnail"] = thumbnail;
  }
  await ProductModel.updateOne({ _id: id }, { $set: product });
  res.redirect("/admin/products");
};
const del = async (req, res) => {
  const { id } = req.params;
  await ProductModel.deleteOne({ _id: id });
  res.redirect("/admin/products");
};
const delSelected = async (req, res) => {
  const id = req.body.selectedProducts;
  await ProductModel.deleteMany({ _id: { $in: id } });
  res.redirect("/admin/products");
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
