const CategoryModel = require("../models/categoryModel");
const UserModel = require("../models/userModel");
const ConfigsModel = require("../models/configModel");
const SliderModel = require("../models/sliderModel");
const BannerModel = require("../models/advertiseModel");
const CustomerModel = require("../models/customerModel");
const AdvertiseModel = require("../models/advertiseModel");
const ProductModel = require("../models/productModel");

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
    res.locals.config = await ConfigsModel.findOne();
    next();
  },

  sliders: async (req, res, next) => {
    res.locals.sliders = await SliderModel.find();

    next();
  },

  advertise: async (req, res, next) => {
    res.locals.advertise = await AdvertiseModel.find();

    next();
  },
  nameProducts: async (req, res, next) => {
    const featuredProducts = await ProductModel.find({ featured: true });
    res.locals.nameProducts = featuredProducts.map((i) => i.name);
    res.locals.thumbnailProducts = featuredProducts.map((i) => i.thumbnail);
    next();
  },
};

module.exports = shareMw;
