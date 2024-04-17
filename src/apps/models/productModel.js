const mongoose = require("../../common/database")();
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      text:true,
    },
    cat_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Categories",
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    accessories: {
      type: String,
      required: true,
    },
    promotion: {
      type: String,
      required: true,
    },
    warranty: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default:"", 
  },
    featured: {
      type: Boolean,
      default: false,
    },
    is_stock: {
        type: Boolean,
        default: false,
    },
  },
  {
    timestamps: true,
  }
);
const ProductModel  = mongoose.model("Products", productSchema,"products");
module.exports = ProductModel;