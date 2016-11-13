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
});

router.get('/getAd', function(req, res, next) {
  res.send({ width: '500px', height: '300px' });
})

router.post('/getUser', function(req, res, next) {
  database.showAdBucks(req.body.user[0], function(doc) {
    res.send({bucks: doc.adbucks, show_by_default: doc.show_by_default});
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

router.post('/createAd', function(req, res, next) {
  database.createAd(req.body.username, req.body.name, req.body.url, req.body.src);
  res.redirect('/userhome');
});

router.post('/deleteAd', function(req, res, next) {
  database.deleteAd(req.body.username, req.body.name, req.body.url);
});

router.post('/getUserAds', function(req, res, next) {
  database.getAds(req.body.user[0], function(response) {
    res.send(response);
  });
});

router.post('/getAllAds', function(req, res, next) {
  database.getAdsNot(req.body.user[0], function(response) {
    res.send(response);
  });
});

module.exports = router;
