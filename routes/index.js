var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/ad', function(req, res, next) {
  res.render('ad');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.post('/getUser', function(req, res, next) {
  res.send(req.body.user[0]);
});

module.exports = router;
