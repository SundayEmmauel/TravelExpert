var express = require("express");
var router = express.Router();
const { Package } = require("../models/package");
const { Purchase } = require("../models/purchase");
const processErrors = require("./processErrors");

/* GET the add form. */
router.get("/add", function (req, res, next) {
  res.render("packageadd", { add: true });
});
// Process the added package data
router.post("/add", function (req, res, next) {
  const data = req.body;
  const prod = new Package(data);
  // prod.PkgName = req.body.PkgName;
  // prod.PkgDesc = req.body.PkgDesc;
  // prod.Price = req.body.Price;
  // prod.PkgStartDate = req.body.PkgStartDate;
  // prod.PkgEndDate = req.body.PkgEndDate;

  // Make sure the image starts with /imagaes/, or add it to the image path
  if (prod.image && !prod.image.includes("/images/"))
    prod.image = "/images/" + prod.image;
  prod.save(function (err) {
    // Create a new record in the DB
    if (err) return processErrors(err, "packageadd", req, res, { add: true });
    res.redirect("/"); // Always redirect to another page after you process the form submission
  });
});

/* GET the Edit form with given a package Id. */
router.get("/edit/:prodid", function (req, res, next) {
  const prodid = req.params.prodid;
  Package.findById(prodid, (err, prod) => {
    if (err) console.log(err);
    res.render("packageadd", { prod, add: false });
  });
});
// Process the edited package data
router.post("/edit/:prodid", function (req, res, next) {
  const prodid = req.params.prodid;
  new Package(req.body).validate((err) => {
    // To validate the data before updating
    if (err)
      return processErrors(err, "packageadd", req, res, {
        add: false,
        prod: { ...req.body, _id: prodid },
      });
    Package.findByIdAndUpdate(prodid, req.body, function (err) {
      if (err)
        return processErrors(err, "packageadd", req, res, { add: false });
      res.redirect("/package/details/" + prodid);
    });
  });
});

/* Delete a book, given its Id. */
router.get("/delete/:prodid", function (req, res, next) {
  const prodid = req.params.prodid;
  Package.findByIdAndDelete(prodid, (err) => {
    if (err) console.log(err);
    //req.session.msg = `Package deleted ${prodid}`;
    res.redirect("/");
  });
});

/* GET the package details page, for the given package Id. */
router.get("/details/:prodid", function (req, res, next) {
  const prodid = req.params.prodid;
  Package.findById(prodid, (err, prod) => {
    if (err) console.log(err);
    res.render("packagedetails", { prod });
  });
});

// Process the buy package data
router.post("/buy", function (req, res, next) {
  const purchase = new Purchase();
  purchase.userId = 3;
  purchase.packageId = req.body.packageId;
  purchase.quantity = req.body.quantity;
  purchase.save(function (err) {
    if (err) return processErrors(err, "packagedetails", req, res, req.body);
    res.redirect("/package/purchases");
  });
});

/* GET the purchases page. */
router.get("/purchases/", function (req, res, next) {
  Purchase.find({ userId: 3 })
    // Replace the packageId with the corresponding package object from the packages collection(table)
    .populate("packageId")
    .exec((err, purchases) => {
      if (err) console.log(err);
      res.render("purchases", { purchases });
    });
});

/* Process the package return, sent as GET request, for the given package Id. */
router.get("/return/:purchaseid", function (req, res, next) {
  const purchaseid = req.params.purchaseid;
  Purchase.findOneAndDelete({ _id: purchaseid }, (err) => {
    if (err) console.log(err);
    res.redirect("/package/purchases"); // Redirect to the purchases page
  });
});

module.exports = router;
