const mongoose = require("../../common/database")();
const sliderSchema = new mongoose.Schema({
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
const SlideModel = mongoose.model("Sliders", sliderSchema, "sliders");
module.exports = SlideModel;
