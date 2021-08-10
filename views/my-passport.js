// npm i bcryptjs
// npm i express-session
// npm i passport
// npm i passport-local
const passport = require("passport");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;

// Configure the app to use Passport
module.exports.init = function (app) {
  app.use(
    require("express-session")({
      secret: process.env.PASSPORT_SECRET || "wserjoifjpsiofjfsdfs",
      resave: true,
      saveUninitialized: true,
    })
  );

  // Use a User Model to store and retrieve the user information
  const { Register } = require("./models/userMdl");

  passport.use(
    // Do the login check
    new LocalStrategy(function (username, password, done) {
      Register.findOne({ username: username }, function (err, register) {
        if (err) {
          return done(err);
        } // Error loading user from DB
        if (!user) {
          return done(null, false);
        } // No user
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            // passwords match! log user in
            return done(null, register);
          } else {
            // passwords do not match!
            return done(null, false, { msg: "Incorrect password" });
          }
        });
      });
    })
  );
  // Serialize the User ID
  passport.serializeUser(function (register, done) {
    done(null, register.id);
  });
  // Deserialize the user ID
  passport.deserializeUser(function (id, done) {
    Register.findById(id, function (err, register) {
      done(err, register);
    });
  });
  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());
  // Login Endpoint, recieves the user login from a login form
  // app.post(
  //   "/login",
  //   passport.authenticate("local", { failureRedirect: "/" }),
  //   function (req, res) {
  //     req.session.msg = "Invalid login. Please try again.";
  //     res.redirect("/");
  //   }
  // );

  app.post("login", function (req, res, next) {
    passport.authenticate("local", function (err, register, info) {
      if (err) {
        return next(err);
      }
      if (!register) {
        return res.redirect("/");
      }
      req.logIn(register, function (err) {
        if (err) {
          res.locals.errors = ["Login failed"];
          return next(err);
        }
        return res.redirect("/"); // Logged in
      });
    })(req, res, next);
  });

  // After login, adds the user object to locals.currentUser which is accesible in the .pug files
  app.use((req, res, next) => {
    res.locals.currentUser = req.register;
    next();
  });

  // The logout endpoint
  app.get("/log-out", (req, res) => {
    req.logout();
    res.redirect("/");
  });
};
