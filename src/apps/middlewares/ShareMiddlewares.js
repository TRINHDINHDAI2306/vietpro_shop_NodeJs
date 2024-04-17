const CategoryModel = require("../models/categoryModel");
const SlideModel = require("../models/slideModel");
const AdvertiseModel = require("../models/advertiseModel");

module.exports = async (req, res, next) => {
  res.locals.categories = await CategoryModel.find().sort({_id:1});
  res.locals.totalCartItems = req.session.cart.reduce((total, item)=>total + item.qty, 0);
  res.locals.slides = await SlideModel.find();
  res.locals.advertise = await AdvertiseModel.find();
  next();
};
