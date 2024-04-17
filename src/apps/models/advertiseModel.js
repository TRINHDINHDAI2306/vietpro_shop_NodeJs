const mongoose = require("../../common/database")();
const advertiseSchema = new mongoose.Schema({
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
const AdvertiseModel = mongoose.model(
  "Advertise",
  advertiseSchema,
  "advertise"
);
module.exports = AdvertiseModel;
