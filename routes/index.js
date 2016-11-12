var express = require('express');

var database = require('../public/javascripts/database.js');

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

router.get('/userhome', function(req, res, next) {
  res.render('userhome');
})

router.post('/getUser', function(req, res, next) {
  database.showAdBucks(req.body.user[0], function(bucks) {
    res.send({bucks: bucks});
  });
});

router.post('/deductUser', function(req, res, next) {
  database.subAdBuck(req.body.user[0], function(bucks) {
    res.send({bucks: bucks});
  });
});

router.post('/addUser', function(req, res, next) {
  database.addAdBuck(req.body.user[0], function(bucks) {
    res.send({bucks: bucks});
  });
});

module.exports = router;
