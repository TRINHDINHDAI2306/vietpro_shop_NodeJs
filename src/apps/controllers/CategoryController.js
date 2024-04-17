const CategoryModel = require("../models/categoryModel");
const pagination = require("../../common/pagination");
const index = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = page * limit - limit;
  const categories = await CategoryModel.find()
    .sort({ _id: 1 })
    .skip(skip)
    .limit(limit);
  const totalRows = await CategoryModel.find().countDocuments();
  const totalPages = Math.ceil(totalRows / limit);
  res.render("admin/categories/category", {
    categories,
    pages: pagination(page, limit, totalRows),
    page,
    totalPages,
  });
};
const create = async (req, res) => {
  res.render("admin/categories/add_category", { data: {} });
};
// const store = async (req, res) => {
//   const body = req;
//   let error = null;

//   const category = {
//     description: body.description,
//     title: body.title,
//     slug: body.slug,
//   };
//   const checkCategory = await CategoryModel.findOne({ title: body.title });
//   if (checkCategory) {
//     error = "Danh mục đã tồn tại !";
//     return res.render("admin/categories/add_category", { data: { error },category });
//   }else{
//   await new CategoryModel(category).save();
//   res.redirect("/admin/categories");
//   }
// };
const store = async (req, res) => {
  const { description, title, slug } = req.body;
  let error = null;

  try {
    const checkCategory = await CategoryModel.findOne({ title });
    if (checkCategory) {
      error = "Danh mục đã tồn tại!";
      return res.render("admin/categories/add_category", {
        data: { error },
        category: { description, title, slug },
      });
    }

    await new CategoryModel({ description, title, slug }).save();
    res.redirect("/admin/categories");
  } catch (err) {
    console.error("Error storing category:", err);
    error = "Đã có lỗi xảy ra khi lưu danh mục.";
    return res.render("admin/categories/add_category", {
      data: { error },
      category: { description, title, slug },
    });
  }
};

const edit = async (req, res) => {
  const id = req.params.id;
  const category = await CategoryModel.findById({ _id: id });
  res.render("admin/categories/edit_category", { data: {}, category });
};
// const update = async (req, res) => {
//   const id = req.params.id;
//   const category = await CategoryModel.findById({ _id: id });
//   const body = req;
//   let error = null;
//   const updateCategory = {
//     description: body.description,
//     title: body.title,
//     slug: body.slug,
//   };
//   const checkCategory = await CategoryModel.findOne({ title: body.title });
//   if (checkCategory) {
//     error = "Danh mục đã tồn tại !";
//     return res.render("admin/categories/add_category", {
//       data: { error },
//       category,
//     });
//   }
//   await CategoryModel.updateOne({ _id: id }, { $set: updateCategory });
//   res.redirect("/admin/categories");
// };
const update = async (req, res) => {
  const id = req.params.id;
  const { description, title, slug } = req.body;
  let error = null;

  const updateCategory = {
    description,
    title,
    slug,
  };

  try {
    const existingCategory = await CategoryModel.findOne({ title });
    if (existingCategory && existingCategory._id.toString() !== id) {
      error = "Danh mục đã tồn tại!";
      return res.render("admin/categories/edit_category", {
        data: { error },
        category: updateCategory,
      });
    } else {
      await CategoryModel.updateOne({ _id: id }, { $set: updateCategory });
      res.redirect("/admin/categories");
    }
  } catch (err) {
    console.error("Error in update:", err);
    error = "Đã xảy ra lỗi khi cập nhật danh mục.";
    return res.render("admin/categories/edit_category", {
      data: { error },
      category: updateCategory,
    });
  }
};
const del = async (req, res) => {
  const { id } = req.params;
  await CategoryModel.deleteOne({ _id: id });
  res.redirect("/admin/categories");
};
module.exports = {
  index,
  create,
  store,
  edit,
  update,
  del,
};
