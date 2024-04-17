const categoryModel = require("../models/categoryModel");
const testForm = (req, res)=>{
  categoryModel.find({}, (err,docs)=>{
    console.log(docs);
  });
}
const actionForm = (req, res) => {
  res.send(req.body.email);
};
module.exports = {
  testForm,
  actionForm,
};
