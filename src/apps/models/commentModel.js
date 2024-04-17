const mongoose = require("../../common/database")();
const commentSchema = new mongoose.Schema(
  {
    prd_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Products",
    },
    full_name: {
      type: String,
      required: true,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    body: {
      type: String,
      default: null,
    },
    role: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
const CommentModel = mongoose.model("Comments", commentSchema, "comments");
module.exports = CommentModel;
