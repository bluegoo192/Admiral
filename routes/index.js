var express = require('express');

var database = require('../public/javascripts/database.js');
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Admiral' });
});

router.get('/ad', function(req, res, next) {
  res.render('ad', {query: req.query});
});

router.get('/adlong', function(req, res, next) {
  res.render('adlong', {query: req.query});
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login_attempt', function(req, res, next) {
  database.accountExists(req.body.username, req.body.password, function(equals) {
  	if (equals) {
      var string = encodeString(req.body.username);
  		res.redirect('/userhome/?valid=' + string);
  	} else {
  		res.redirect('/login');
  	}
  });
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.post('/user_signup', function(req, res, next) {
  console.log("I'm in the post...");
  database.createAccount(req.body.user_email, req.body.user_pass, function(success) {
  	if (success) {
  		console.log("Success!");
  		res.redirect('/login');
  	} else {
  		res.redirect('/signup');
  	}
  });
});

router.post('/site_signup', function(req, res, next) {
  database.createAccount(req.body.site_email, req.body.site_pass, function(success) {
  	if (success) {
  		console.log("Success!");
  		res.redirect('/login');
  	} else {
  		res.redirect('/signup');
  	}
  });
});

router.post('/captcha', function(req, res, next) {
  console.log('checking');
  // g-recaptcha-response is the key that browser will generate upon form submit.
  // if its blank or null means user has not selected the captcha, so return the error.
  if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
    return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
  }
  // Put your secret key here.
  var secretKey = "6LcEfBMUAAAAAKd8b3LrKFHQ-darPH_GA5gb_PPh";
  // req.connection.remoteAddress will provide IP address of connected user.
  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
  // Hitting GET request to the URL, Google will respond with success or error scenario.
  request(verificationUrl,function(error,response,body) {
    body = JSON.parse(body);
    // Success will be true or false depending upon captcha validation.
    if(body.success !== undefined && !body.success) {
      return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
    }
    console.log('..succeeded');
    res.redirect('/userhome');
  });
})

router.post('/ad_signup', function(req, res, next) {
  database.createAccount(req.body.ad_email, req.body.ad_pass, function(success) {
  	if (success) {
  		console.log("Success!");
  		res.redirect('/login');
  	} else {
  		res.redirect('/signup');
  	}
  });
});

router.post('/dollars', function(req, res, next) {
  database.showDollars(req.body.user[0], function(dollars) {
    res.send({dollars: dollars});
  });
});

router.post('/transferMoney', function(req, res, next) {
  database.transferAdBucks(req.body.user[0], function(dollars) {
    res.send({dollars: dollars});
  });
});

router.get('/userhome', function(req, res, next) {
  if (req.query.valid) {
    var user = decodeString(req.query.valid);
    res.render('userhome', {user: user});
  } else {
    res.render('userhome');
  }
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
  database.subAdBuck(req.body.user[0], 1, function(bucks) {
    res.send({bucks: bucks});
  });
});

router.post('/addUser', function(req, res, next) {
  database.addAdBuck(req.body.user[0], 2, function(bucks) {
    res.send({bucks: bucks});
  });
});

router.post('/addUser1', function(req, res, next) {
  database.addAdBuck(req.body.user[0], 1, function(bucks) {
    res.send({bucks: bucks});
  });
});

router.post('/deductUser2', function(req, res, next) {
  database.subAdBuck(req.body.user[0], 2, function(bucks) {
    res.send({bucks: bucks});
  });
});

router.post('/createAd', function(req, res, next) {
  database.createAd(req.body.username, req.body.name, req.body.url, req.body.src);
  res.redirect('/userhome');
});

router.post('/deleteAd', function(req, res, next) {
  database.deleteAd(req.body.username, req.body.name, req.body.url, req.body.src, function(response) {
    res.redirect(req.get('referer'));

  });
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

function encodeString(string) {
    return Base64.encode(string);
}

function decodeString(string) {
  return Base64.decode(string);
}

module.exports = router;
