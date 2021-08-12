var express = require("express");
var router = express.Router();
const { Product } = require("../models/product");
const { Purchase } = require("../models/purchase");
const processErrors = require("./processErrors");

/* GET the add form. */
router.get("/add", function (req, res, next) {
  res.render("productadd", { add: true });
});
// Process the added product data
router.post("/add", function (req, res, next) {
  const data = req.body;
  const prod = new Product(data);
  // Make sure the image starts with /imagaes/, or add it to the image path
  if (prod.image && !prod.image.includes("/images/"))
    prod.image = "/images/" + prod.image;
  prod.save(function (err) {
    // Create a new record in the DB
    if (err) return processErrors(err, "productadd", req, res, { add: true });
    res.redirect("/"); // Always redirect to another page after you process the form submission
  });
});

/* GET the Edit form with given a product Id. */
router.get("/edit/:prodid", function (req, res, next) {
  const prodid = req.params.prodid;
  Product.findById(prodid, (err, prod) => {
    if (err) console.log(err);
    res.render("productadd", { prod, add: false });
  });
});
// Process the edited product data
router.post("/edit/:prodid", function (req, res, next) {
  const prodid = req.params.prodid;
  new Product(req.body).validate((err) => {
    // To validate the data before updating
    if (err)
      return processErrors(err, "productadd", req, res, {
        add: false,
        prod: { ...req.body, _id: prodid },
      });
    Product.findByIdAndUpdate(prodid, req.body, function (err) {
      if (err)
        return processErrors(err, "productadd", req, res, { add: false });
      res.redirect("/product/details/" + prodid);
    });
  });
});

/* Delete a book, given its Id. */
router.get("/delete/:prodid", function (req, res, next) {
  const prodid = req.params.prodid;
  Product.findByIdAndDelete(prodid, (err) => {
    if (err) console.log(err);
    //req.session.msg = `Product deleted ${prodid}`;
    res.redirect("/");
  });
});

/* GET the product details page, for the given product Id. */
router.get("/details/:prodid", function (req, res, next) {
  const prodid = req.params.prodid;
  Product.findById(prodid, (err, prod) => {
    if (err) console.log(err);
    res.render("productdetails", { prod });
  });
});

// Process the buy product data
router.post("/buy", function (req, res, next) {
  const purchase = new Purchase();
  purchase.userId = 3;
  purchase.productId = req.body.productId;
  purchase.quantity = req.body.quantity;
  purchase.save(function (err) {
    if (err) return processErrors(err, "productdetails", req, res, req.body);
    res.redirect("/product/purchases");
  });
});

/* GET the purchases page. */
router.get("/purchases/", function (req, res, next) {
  Purchase.find({ userId: 3 })
    // Replace the productId with the corresponding product object from the products collection(table)
    .populate("productId")
    .exec((err, purchases) => {
      if (err) console.log(err);
      res.render("purchases", { purchases });
    });
});

/* Process the product return, sent as GET request, for the given product Id. */
router.get("/return/:purchaseid", function (req, res, next) {
  const purchaseid = req.params.purchaseid;
  Purchase.findOneAndDelete({ _id: purchaseid }, (err) => {
    if (err) console.log(err);
    res.redirect("/product/purchases"); // Redirect to the purchases page
  });
});

module.exports = router;
