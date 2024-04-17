const express = require("express");
const AuthMiddlewares = require("../apps/middlewares/AuthMiddlewares");
const UploadMiddlewares = require("../apps/middlewares/UploadMiddlewares");
const router = express.Router();
// Admin Controller
const AdminController = require("../apps/controllers/AdminController");
const AuthController = require("../apps/controllers/AuthController");
const ProductController = require("../apps/controllers/ProductController");
const UserController = require("../apps/controllers/UserController");
const CategoryController = require("../apps/controllers/CategoryController");
const SiteController = require("../apps/controllers/SiteController");
const CommentController = require("../apps/controllers/CommentController");
const SlideController = require("../apps/controllers/SlideController");
const AdvertiseController = require("../apps/controllers/AdvertiseController");
const OrderController = require("../apps/controllers/OrderController");
// test
const TestController = require("../apps/controllers/TestController");
router.get("/testform", TestController.testForm);
router.post("/testform", TestController.actionForm);
// Router admin
router.get("/admin/login", AuthMiddlewares.checkLogin, AuthController.getLogin);
router.post(
  "/admin/login",
  AuthMiddlewares.checkLogin,
  AuthController.postLogin
);
router.get("/admin/logout", AuthMiddlewares.checkAdmin, AuthController.logout);
router.get(
  "/admin/dashboard",
  AuthMiddlewares.checkAdmin,
  AdminController.index
);
router.get("/admin/register", AuthController.getRegister);
router.post("/admin/store", AuthController.store);
router.get("/admin/success", AuthController.success);

// router products

router.get(
  "/admin/products",
  // AuthMiddlewares.checkAdmin,
  ProductController.index
);
router.get(
  "/admin/products/create",
  // AuthMiddlewares.checkAdmin,
  ProductController.create
);
router.post(
  "/admin/products/store",
  UploadMiddlewares.single("thumbnail"),
  // AuthMiddlewares.checkAdmin,
  ProductController.store
);
router.get(
  "/admin/products/edit/:id",
  // AuthMiddlewares.checkAdmin,
  ProductController.edit
);

router.post(
  "/admin/products/update/:id",
  UploadMiddlewares.single("thumbnail"),
  // AuthMiddlewares.checkAdmin,
  ProductController.update
);
router.get("/admin/products/delete/:id", ProductController.del);

// router users

router.get(
  "/admin/users",
  // AuthMiddlewares.checkAdmin,
  UserController.index
);
router.get(
  "/admin/users/create",
  // AuthMiddlewares.checkAdmin,
  UserController.create
);
router.post(
  "/admin/users/store",
  // AuthMiddlewares.checkAdmin,
  UserController.store
);
router.get(
  "/admin/users/edit/:id",
  // AuthMiddlewares.checkAdmin,
  UserController.edit
);

router.post(
  "/admin/users/update/:id",
  UploadMiddlewares.single("thumbnail"),
  // AuthMiddlewares.checkAdmin,
  UserController.update
);
router.get("/admin/users/delete/:id", UserController.del);

// router category

router.get(
  "/admin/categories",
  // AuthMiddlewares.checkAdmin,
  CategoryController.index
);
router.get(
  "/admin/categories/create",
  // AuthMiddlewares.checkAdmin,
  CategoryController.create
);
router.post(
  "/admin/categories/store",
  // AuthMiddlewares.checkAdmin,
  CategoryController.store
);
router.get(
  "/admin/categories/edit/:id",
  // AuthMiddlewares.checkAdmin,
  CategoryController.edit
);

router.post(
  "/admin/categories/update/:id",
  UploadMiddlewares.single("thumbnail"),
  // AuthMiddlewares.checkAdmin,
  CategoryController.update
);
router.get("/admin/categories/delete/:id", CategoryController.del);

//Router Comment
router.get(
  "/admin/comments",
  // AuthMiddlewares.checkAdmin,
  CommentController.index
);
router.get(
  "/admin/comments/edit/:id",
  // AuthMiddlewares.checkAdmin,
  CommentController.edit
);
router.get(
  "/admin/comments/approve/:id",
  // AuthMiddlewares.checkAdmin,
  CommentController.approve
);
router.post(
  "/admin/comments/update/:id",
  UploadMiddlewares.single("thumbnail"),
  // AuthMiddlewares.checkAdmin,
  CommentController.update
);

router.get("/admin/comments/delete/:id", CommentController.del);
router.post("/admin/comments/delete-selected", CommentController.delSelected);

router.get("/admin/slides", SlideController.index);
router.get(
  "/admin/slides/create",
  // AuthMiddlewares.checkAdmin,
  SlideController.create
);
router.post(
  "/admin/slides/store",
  UploadMiddlewares.single("image"),
  // AuthMiddlewares.checkAdmin,
  SlideController.store
);
router.get(
  "/admin/slides/edit/:id",
  // AuthMiddlewares.checkAdmin,
  SlideController.edit
);
router.post(
  "/admin/slides/update/:id",
  UploadMiddlewares.single("image"),
  // AuthMiddlewares.checkAdmin,
  SlideController.update
);
router.get("/admin/slides/delete/:id", SlideController.del);

// Advertis
router.get("/admin/advertise", AdvertiseController.index);
router.get(
  "/admin/advertise/create",
  // AuthMiddlewares.checkAdmin,
  AdvertiseController.create
);
router.post(
  "/admin/advertise/store",
  UploadMiddlewares.single("image"),
  // AuthMiddlewares.checkAdmin,
  AdvertiseController.store
);

router.get(
  "/admin/advertise/edit/:id",
  // AuthMiddlewares.checkAdmin,
  AdvertiseController.edit
);
router.post(
  "/admin/advertise/update/:id",
  UploadMiddlewares.single("image"),
  // AuthMiddlewares.checkAdmin,
  AdvertiseController.update
);
router.get("/admin/advertise/delete/:id", AdvertiseController.del);
// order
router.get("/admin/orders", OrderController.index);
router.get("/admin/orders/delete/:id", OrderController.del);
// Router Site
router.get("/", SiteController.home);
router.get("/category-:slug.:id", SiteController.category);
router.get("/product-:slug.:id", SiteController.product);
router.post("/product-:slug.:id", SiteController.comment);
router.post("/subscribe", SiteController.sbmCmt);
router.get("/search", SiteController.search);
router.get("/cart", SiteController.cart);
router.post("/add-to-cart", SiteController.addToCart);
router.post("/update-item-cart", SiteController.updateItemCart);
router.get("/delete-item-cart-:id", SiteController.deleteItemCart);
router.get("/success", SiteController.success);
router.post("/order", SiteController.order);
module.exports = router;
