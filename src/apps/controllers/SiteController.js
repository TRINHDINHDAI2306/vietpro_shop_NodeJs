const ProductModel = require("../models/productModel");
const CategoryModel = require("../models/categoryModel");
const CommentModel = require("../models/commentModel");
const OrderModel = require("../models/orderModel");
const request = require("request");
const pagination = require("../../common/pagination");
const transporter = require("../../common/transporter");
const ejs = require("ejs");
const path = require("path");
const moment = require("moment");
const home = async (req, res) => {
  const featured = await ProductModel.find({
    featured: 1,
  })
    .sort({ _id: -1 })
    .limit(6);
  const latest = await ProductModel.find({
    latest: 1,
  })
    .sort({ _id: -1 })
    .limit(6);
  res.render("site/index", { latest, featured });
};
const category = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 9;
  const skip = page * limit - limit;
  const { id } = req.params;
  const products = await ProductModel.find({
    cat_id: id,
  })
    .skip(skip)
    .limit(limit);
  const category = await CategoryModel.findById(id);
  const totalRows = await ProductModel.countDocuments({ cat_id: id });
  const totalPages = Math.ceil(totalRows / limit);
  const total = await ProductModel.find({ cat_id: id }).countDocuments();
  res.render("site/category", {
    products,
    category,
    total,
    pages: pagination(page, limit, totalRows),
    page,
    totalPages,
  });
};
const product = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 4;
  const skip = page * limit - limit;
  const { id } = req.params;
  const product = await ProductModel.findById(id);
  const totalRows = await CommentModel.find({ prd_id: id }).countDocuments();
  const totalPages = Math.ceil(totalRows / limit);
  const comments = await CommentModel.find({ prd_id: id, role: true })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);
  res.render("site/product", {
    product,
    comments,
    moment,
    pages: pagination(page, limit, totalRows),
    page,
    totalPages,
  });
};
const comment = async (req, res) => {
  const { id } = req.params;
  let checkComment = req.body.com_body;
  const abusiveWords = ["clm", "ml", "Dm"];
  for (let word of abusiveWords) {
    checkComment = checkComment.replace(
      new RegExp(word, "gi"),
      "*".repeat(word.length)
    );
  }
  const comment = {
    prd_id: id,
    email: req.body.com_mail,
    full_name: req.body.com_name,
    body: checkComment,
  };
  await new CommentModel(comment).save();
  res.redirect(req.path);
};
const sbmCmt = (req, res) => {
  if(req.body.captcha === undefined || req.body.captcha===null||req.body.captcha==='')
  {
    return res.json({
      success: false,
      message: "Failed Captcha verification",
    });
  }
  const secretKey = "6Le_kr0pAAAAAKZdiyQz4vNiudBJ5oiQkP7pUlA3";
  const verifyUrl =
    `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;
  request(verifyUrl, (err, response, body) => {
    body = JSON.parse(body);
    if (body.success !== undefined && !body.success) {
      return res.json({
        success: false,
        message: "Failed Captcha verification",
      });
    }
    return res.json({ success: true, message: "Captcha Passed" });
  });

};
const search = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 9;
  const skip = page * limit - limit;
  const keyword = req.query.keyword || "";
  const products = await ProductModel.find({ $text: { $search: keyword } })
    .skip(skip)
    .limit(limit);
  const totalRows = await ProductModel.countDocuments({
    $text: { $search: keyword },
  });
  const totalPages = Math.ceil(totalRows / limit);
  res.render("site/search", {
    products,
    keyword,
    pages: pagination(page, limit, totalRows),
    page,
    totalPages,
  });
};
const cart = (req, res) => {
  const items = req.session.cart;
  res.render("site/cart", { items });
};
const addToCart = async (req, res) => {
  const { body } = req;
  let items = req.session.cart;
  let isProductExists = false;
  const newItems = items.map((item) => {
    if (body.id === item.id) {
      isProductExists = true;
      item.qty += parseInt(body.qty);
    }
    return item;
  });
  if (!isProductExists) {
    const product = await ProductModel.findById(body.id);
    newItems.push({
      _id: body.id,
      name: product.name,
      price: product.price,
      thumbnail: product.thumbnail,
      qty: parseInt(body.qty),
    });
  }
  req.session.cart = newItems;
  res.redirect("/cart");
};
const updateItemCart = (req, res) => {
  const items = req.session.cart;
  const { products } = req.body;
  const newItems = items.map((item) => {
    item.qty = parseInt(products[item._id]["qty"]);
    return item;
  });
  req.session.cart = newItems;
  res.redirect("/cart");
};
const deleteItemCart = (req, res) => {
  const items = req.session.cart;
  const { id } = req.params;
  const newItems = items.filter((item) => item._id !== id);
  req.session.cart = newItems;
  res.redirect("/cart");
};
const order = async (req, res) => {
  const items = req.session.cart;
  const { body } = req;
  const total_price = items.reduce(
    (total, item) => total + item.qty * item.price,
    0
  );
  console.log(total_price);
  const viewFolder = req.app.get("views");
  const html = await ejs.renderFile(
    path.join(viewFolder, "site/email-order.ejs"),
    {
      ...body,
      items,
    }
  );
  await transporter.sendMail({
    from: '"Vietpro Store" vietpro.edu.vn@gmail.com', // sender address
    to: body.mail, // list of receivers
    subject: "Xác nhận đơn hàng từ Vietpro Store ✔", // Subject line
    html, // html body
  });
  const newOrder = {
    full_name: body.name,
    email: body.mail,
    address: body.add,
    phone: body.phone,
    items: items.map((item) => ({
      prd_id: item.id,
      name: item.name,
      price: item.price,
      qty: item.qty,
    })),
    total_price,
  };
  new OrderModel(newOrder).save();
  req.session.cart = [];
  res.redirect("/success");
};
const success = (req, res) => {
  res.render("site/success");
};

module.exports = {
  home,
  category,
  product,
  search,
  comment,
  sbmCmt,
  cart,
  addToCart,
  updateItemCart,
  deleteItemCart,
  order,
  success,
};
