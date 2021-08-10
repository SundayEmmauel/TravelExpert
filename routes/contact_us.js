var express = require('express');
var router = express.Router();

var Contact = require("../models/contactMdl").Contact
/* GET users listing. */
router.get('/', function (req, res, next) {
  Contact.find((err, cd) => {
    res.render('contact_us', {
      pagetitle: 'Contact us',
      contactdetails: cd
    });
  });
});

router.post('/', function (req, res, next) {
  console.log(req.body);
  var contact = new Contact()
  contact.name = req.body.name;
  contact.email = req.body.email
  contact.comment = req.body.comment
  contact.save((err) => {
    // if (err) throw erro;
    if (err) {
      const errorArray = [];
      const errorKeys = Object.keys(err.errors);
      errorKeys.forEach((key) => errorArray.push(err.errors[key].message));
      return res.render("contact_us", {
        errors: errorArray,
      });
    }
    res.render("index");

  })
});

module.exports = router;
