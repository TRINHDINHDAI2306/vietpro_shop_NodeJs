const AdvertiseModel = require("../models/advertiseModel");
const pagination = require("../../common/pagination");
const fs = require("fs");
const path = require("path");
const index = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = page * limit - limit;
  const advertise = await AdvertiseModel.find()
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);
  const totalRows = await AdvertiseModel.find().countDocuments();
  const totalPages = Math.ceil(totalRows / limit);
  res.render("admin/advertise/advertise", {
    advertise,
    pages: pagination(page, limit, totalRows),
    page,
    totalPages,
  });
};
const create = async (req, res) => {
  res.render("admin/advertise/add_advertise");
};
const store = async (req, res) => {
  const { body, file } = req;
  const advertise = {
    name: body.name,
  };
  if (file) {
    const image = `advertise/${file.originalname}`;
    fs.renameSync(file.path, path.resolve("src/public/uploads/images/", image));
    advertise["image"] = image;
    new AdvertiseModel(advertise).save();
    return res.redirect("/admin/advertise");
  }
};
const edit = async (req, res) => {
  const { id } = req.params;
  const advertise = await AdvertiseModel.findById({ _id: id });
  res.render("admin/advertise/edit_advertise", { advertise: advertise });
};
const update = async (req, res) => {
  const { id } = req.params;
  const { body, file } = req;
  const advertise = {
    name: body.name,
    // thumbnail: body.thumbnail,
  };
  if (file) {
    const image = `advertise/${file.originalname}`;
    fs.renameSync(file.path, path.resolve("src/public/uploads/images/", image));
    advertise["image"] = image;
    await AdvertiseModel.updateOne({ _id: id }, { $set: advertise });
    return res.redirect("/admin/advertise");
  }
};

const del = async (req, res) => {
  const { id } = req.params;
  await AdvertiseModel.deleteOne({ _id: id });
  res.redirect("/admin/advertise");
};
module.exports = {
  index,
  create,
  store,
  edit,
  update,
  del,
};
