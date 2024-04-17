const SlideModel = require("../models/slideModel");
const pagination = require("../../common/pagination");
const fs = require("fs");
const path = require("path");
const index = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = page * limit - limit;
  const slides = await SlideModel.find()
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);
  const totalRows = await SlideModel.find().countDocuments();
  const totalPages = Math.ceil(totalRows / limit);
  res.render("admin/slides/slide", {
    slides,
    pages: pagination(page, limit, totalRows),
    page,
    totalPages,
  });
};
const create = async (req, res) => {
  res.render("admin/slides/add_slide");
};
const store = async (req, res) => {
  const { body, file } = req;
  const slide = {
    name: body.name,
    // thumbnail: body.thumbnail,
  };
  if (file) {
    const image = `slides/${file.originalname}`;
    fs.renameSync(file.path, path.resolve("src/public/uploads/images/", image));
    slide["image"] = image;
    new SlideModel(slide).save();
    return res.redirect("/admin/slides");
  }
};
const edit = async (req, res) => {
  const {id} = req.params;
  const slide = await SlideModel.findById({_id: id});
  res.render("admin/slides/edit_slide",{slide: slide});
};
const update = async (req, res) => {
  const { id } = req.params;
  const { body, file } = req;
  const slide = {
    name: body.name,
    // thumbnail: body.thumbnail,
  };
  if (file) {
    const image = `slides/${file.originalname}`;
    fs.renameSync(file.path, path.resolve("src/public/uploads/images/", image));
    slide["image"] = image;
    await SlideModel.updateOne({ _id: id }, { $set: slide });
    return res.redirect("/admin/slides");
  }
};
const approve = async (req, res) => {};
const del = async (req, res) => {
  const { id } = req.params;
  await SlideModel.deleteOne({ _id: id });
  res.redirect("/admin/slides");
};
module.exports = {
  index,
  create,
  store,
  edit,
  update,
  approve,
  del,
};
