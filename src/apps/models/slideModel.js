const mongoose = require("../../common/database")();
const slideSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  role: {
    type: Boolean,
    default: false,
  },
});
const SlideModel = mongoose.model("Slides", slideSchema, "slides");
module.exports = SlideModel;
