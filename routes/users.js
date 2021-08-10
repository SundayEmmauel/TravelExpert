var express = require('express');
var router = express.Router();
const switchUserRole = require("../models/switchUserRole");

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});



/* Switch the user role. */
router.get("/switchrole/:userId/:newRol", function (req, res, next) {
  // Check if the user is not logged in or the user is not a manager,
  // redirect to home page
  if (!req.register || req.register.role !== "manager") {
    req.session.msg = "You are not allowed to change user roles.";
    return res.redirect("/");
  }
  const userId = req.params.userId;
  if (!userId) return res.redirect("/");
  switchUserRole(userId, req.params.newRol, (err) => {
    req.session.msg = "User role changed.";
    if (err) {
      req.session.msg = err;
    }
    res.redirect("/");
  });
});


module.exports = router;
