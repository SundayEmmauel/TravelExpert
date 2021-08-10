var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('about', {
    pagetitle: 'About us',
  });
});

// router.get('/about', function (req, res, next) {
//   res.send('about');
// });

module.exports = router;
