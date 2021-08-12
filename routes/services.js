var express = require('express');
var router = express.Router();
var router = express.Router();
const { Package } = require("../models/package");

/* GET home page. */
router.get('/', function (req, res, next) {
  // console.log(res.locals.currentUser);
  // res.render('index', {
  //   pagetitle: 'Home',
  //   dt: (new Date()).toString(),
  // });

  if (req.register)
    req.user.userDetails.then((details) => {
      console.log("Index back", details);
    });
  Package.find({}, (err, packages) => {
    res.render("services", {
      pagetitle: 'Services',
      dt: (new Date()).toString(),
      packages
    });
  });
});


module.exports = router;
