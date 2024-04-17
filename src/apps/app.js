const config = require("config");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: config.get("app.session_key"),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: config.get("app.session_secure") },
  })
);

app.use(require("./middlewares/CartMiddlewares"));
app.use(require("./middlewares/ShareMiddlewares"));


// Hien tai, da cau hinh den thu muc tinh /static = src/public
app.use("/static", express.static(__dirname + "/../public"));
app.set("views", config.get("app.views_folder"));
app.set("view engine", config.get("app.view_engine"));
app.use(require("../routers/web"));
module.exports = app;
