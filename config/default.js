module.exports = {
  app: {
    port: 3000,
    views_folder: __dirname + "/../src/apps/views",
    view_engine: "ejs",
    session_key: "vietPro",
    session_secure: false,
    tmp: __dirname + "/../src/tmp/",
  },
  mail: {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "quantri.vietproshop@gmail.com",
      pass: "tjpj rclg ithn rkby",
    },
  },
};
