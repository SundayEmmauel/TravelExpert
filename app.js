var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var contact_usRouter = require('./routes/contact_us');
var aboutRouter = require('./routes/about');
var registerRouter = require('./routes/register');
var registerRouter = require('./routes/register');
var dataRouter = require("./routes/data");
var productsRouter = require("./routes/product");

const mongoSanitize = require("express-mongo-sanitize");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// to replace prohibited characters with _, use:
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

// -------------------------------------------------------------
// For Passport.js
require("./my-passport").init(app);
// -------------------------------------------------------------
//  Put the messages in the res.locals
app.use((req, res, next) => {
  res.locals.message = req.session.msg; // Read the message from the session variable
  req.session.msg = null;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/about', aboutRouter);
app.use('/contact_us', contact_usRouter);
app.use('/register', registerRouter);
app.use("/data", dataRouter);
app.use("/product", productsRouter);

// -------------------------------------------------------------
// Configure the DB connection using Mongoose
var mongoose = require("mongoose");
// Set up a mongoose connection
// var mongoDBurl = "mongodb://localhost:27017/travelStore";
var mongoDBurl = "mongodb+srv://student_1:desktop890@cluster0.p9dmi.mongodb.net/myTravelStore?retryWrites=true&w=majority";

mongoose.connect(process.env.MONGO_URL || mongoDBurl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// Get the connection
var db = mongoose.connection;
// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

db.once("open", function () {
  console.log("we're connected!");
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
