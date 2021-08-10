var express = require('express');
var router = express.Router();
const { Register } = require("../models/register");
const bcrypt = require("bcryptjs");
const { Customer } = require("../models/customer");
const switchUserRole = require("../models/switchUserRole");

/*-------------- GET Register page. -------------*/
router.get('/', function (req, res, next) {
    Register.find((err, ud) => {
        res.render('sign-up', {
            pagetitle: 'Registration',
            userdetails: ud
        });
    });
});

/* Login page. */
router.get("/login", function (req, res, next) {
    res.render('login', {
        pagetitle: 'Login',
    });
});
//--------------- post register page to process the registration data ------------//
router.post('/', function (req, res, next) {
    console.log(req.body);
    const register = new Register(req.body)
    const errs = register.validateSync(); // Run the model validation
    if (errs) {
        return processErrors(errs, req, res);
    }
    // To hash the password before saving to DB
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) throw err;
        // Replace the plain password with the hashed password
        register.password = hashedPassword;
        // Generate a random number for the customer Id
        const custId = Math.floor(Math.random() * 100000000);
        //  Create a customer object
        const customer = new Customer({ _id: custId });
        customer.save((err) => {
            // Save the customer data in the DB
            if (err) return processErrors(err, "register", req, res, req.body);
            register.customerId = custId;
            register.save((err) => {
                if (err) {
                    return processErrors(err, req, res, req.body);
                }
                //console.log(result);
                res.redirect("/register/login");
            });
        });
    });



    // ------ Error processing function ------------
    function processErrors(errs, req, res) {
        // If there are errors from the Model schema
        const errorArray = [];
        const errorKeys = Object.keys(errs.errors);
        errorKeys.forEach((key) => errorArray.push(errs.errors[key].message));
        return res.render("sign-up", {

            errors: errorArray,
        });
    }
})


/* Switch the user role. */
router.get("/switchrole/:userId/:newRol", function (req, res, next) {
    // Check if the user is not logged in or the user is not a manager,
    // redirect to home page
    if (!req.user || req.user.role !== "manager") {
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
