var express = require('express');
var router = express.Router();
var router = express.Router();
const { Product } = require("../models/product");

/* GET home page. */
router.get('/', function (req, res, next) {
  // console.log(res.locals.currentUser);
  // res.render('index', {
  //   pagetitle: 'Home',
  //   dt: (new Date()).toString(),
  // });

  if (req.user)
    req.user.userDetails.then((details) => {
      console.log("Index back", details);
    });
  Product.find({}, (err, products) => {
    res.render("index", {
      products,
      pagetitle: 'Home',
      dt: (new Date()).toString(),
    });
  });
});


module.exports = router;
