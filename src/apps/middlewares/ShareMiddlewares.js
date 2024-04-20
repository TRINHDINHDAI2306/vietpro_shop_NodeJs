const CategoryModel = require("../models/categoryModel");
const SlideModel = require("../models/slideModel");
const UserModel = require("../models/userModel");
const AdvertiseModel = require("../models/advertiseModel");
const CustomerModel = require("../models/customerModel");
const ConfigModel = require('../models/configModel');
const shareMw = {
  categories: async (req, res, next) => {
    res.locals.categories = await CategoryModel.find();

    next();
  },
  emailUser: async (req, res, next) => {
    const { email } = req.session;
    res.locals.user = await UserModel.findOne({ email });
    next();
  },
  emailCustomer: async (req, res, next) => {
    const { email } = req.session;
    res.locals.customer = await CustomerModel.findOne({ email });
    next();
  },
  cartItems: async (req, res, next) => {
    res.locals.cartItems = req.session.cart;
    next();
  },
  formatPrice: async (req, res, next) => {
    res.locals.formatPrice = (value) => {
      return Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    };
    next();
  },
  config: async (req, res, next) => {
    res.locals.config = await ConfigModel.findOne();
    next();
  },

  sliders: async (req, res, next) => {
    res.locals.sliders = await SlideModel.find();

    next();
  },

  advertise: async (req, res, next) => {
    res.locals.advertise = await AdvertiseModel.find();

    next();
  },
};

module.exports = shareMw;