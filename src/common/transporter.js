const nodemailer = require('nodemailer');
const config = require("config");
const mail = config.get("mail");
const transporter = nodemailer.createTransport(mail);

// async..await is not allowed in global scope, must use a wrapper

// send mail with defined transport object

module.exports = transporter;
