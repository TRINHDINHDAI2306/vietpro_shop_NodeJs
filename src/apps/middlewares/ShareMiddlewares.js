const CategoryModel = require("../models/categoryModel");
const SlideModel = require("../models/slideModel");
const UserModel = require("../models/userModel");
const AdvertiseModel = require("../models/advertiseModel");
const CustomerModel = require("../models/customerModel");
const ConfigModel = require('../models/configModel');
module.exports = async (req, res, next) => {
  res.locals.categories = await CategoryModel.find().sort({_id:1});
  res.locals.user = await UserModel.findOne(req.session.email );
  res.locals.customer = await CustomerModel.findOne( req.session.email );
  res.locals.cartItems = req.session.cart;
  res.locals.totalCartItems = req.session.cart.reduce((total, item)=>total + item.qty, 0);
  res.locals.slides = await SlideModel.find();
  res.locals.advertise = await AdvertiseModel.find();
  res.locals.config = await ConfigModel.findOne();
  res.locals.formatPrice = (value) => {
    return Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };
  next();
};
