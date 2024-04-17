const mongoose = require("../../common/database")();
const orderSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    items: [
      {
        prd_id: {
          type: mongoose.Types.ObjectId,
          ref: "Products",
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        qty: {
          type: Number,
        },
      },
    ],
    total_price: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
const OrderModel = mongoose.model("Orders", orderSchema, "orders");
module.exports = OrderModel;
