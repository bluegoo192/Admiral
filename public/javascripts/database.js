var mongodb = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://garyliangge:NGNL2016@ds149557.mlab.com:49557/adbucks_db');
var Account = require('./schemas/accounts');
var Ad = require('./schemas/ads');
var request = require('request');

var apikey = "1d15e48ca9e6b3db7a8dc1d94b284190"; //Nessie
/* Mongo Shit */

var database = {
  createAccount: function(username, password, callback) {
    var success = false;
    Account.where({user:username}).findOne(function (err, myDocument){
      if (!myDocument) {
        var options = {
          url: 'http://api.reimaginebanking.com/customers?key=' + apikey,
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
              "first_name": username,
              "last_name": "null",
              "address": {
                "street_number": "null",
                "street_name": "null",
                "city": "null",
                "state": "ca",
                "zip": "94306"
              }
            })
        };

        request.post(options, function(error, response, body) {
          if (!error) {
            var options2 = {
              url: 'http://api.reimaginebanking.com/customers/' + JSON.parse(body).objectCreated._id + '/accounts?key=' + apikey,
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
              },
              body: JSON.stringify({
                "type": "Checking",
                "nickname": "Admiral Account",
                "rewards": 0,
                "balance": 0
              })
            };

            request.post(options2, function(error2, response, body2) {
              if (!error2) {
                var newAccount = new Account({
                    user: username,
                    pass: password,
                    adbucks: 100,
                    show_by_default: false,
                    account_id: JSON.parse(body2).objectCreated._id,
                    customer_id: JSON.parse(body).objectCreated._id
                  });
                newAccount.save(function (err) {
                  if (err) {
                    console.log('Error creating account!');
                  } else {
                    console.log('Successfully created account');
                    success = true;
                    callback(success);
                  }
                });
              }
            })
          }
        })
      } else {
        console.log('Cannot create new account: Username already exists!');
      }
    });
  },

  accountExists: function(username, password, callback) {
    var equals = false;
    Account.where({user:username, pass:password}).findOne(function (err, myDocument){
      if (myDocument) {
        console.log("Account exists!!!");
        equals = true;
      } else {
        console.log("Account DOES NOT exists.");
      }
      callback(equals);
    });
  },

  transferAdBucks: function (username, callback) {
    Account.where({user:username}).findOneAndUpdate({'adbucks': 0}, function (err, myDocument){
      if (myDocument) {
        var dollars = myDocument.adbucks / 1000.0;
        var options = {
          url: 'http://api.reimaginebanking.com/accounts/' +  myDocument.account_id + '/deposits?key=' + apikey,
          body: JSON.stringify({
            "medium": "balance",
            "transaction_date": "2016-11-13",
            "amount": dollars,
            "description": "string"
          }),
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        };

        request.post(options, function(error, response, body) {
          if (!error) {
            console.log("Deposited successfully");
            console.log(body);
            callback(JSON.parse(body).objectCreated.amount);
          }
        })
      }
    })
  },

  showDollars: function(username, callback) {
    Account.where({user:username}).findOne(function (err, myDocument) {
      if (myDocument) {
        var options = {
          url: 'http://api.reimaginebanking.com/accounts/' +  myDocument.account_id + '?key=' + apikey,
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        };

        request(options, function(error, response, body) {
          if (!error) {
            callback(JSON.parse(body).balance);
          }
        })
      }
    })
  },

  showAdBucks: function (username, callback) {
    Account.where({user: username}).findOne(function (err, myDocument) {
      callback(myDocument);
    });
  },

  addAdBuck: function (username, amount, callback) {
    Account.where({user: username}).findOneAndUpdate({$inc: {'adbucks': amount}}, function(err, doc) {
      if (doc) {
        callback(doc.adbucks);
      }
    });
  },

  subAdBuck: function(username, amount, callback) {
    Account.where({user: username}).findOneAndUpdate({$inc: {'adbucks': -1 * amount}}, function(err, doc) {
      if (doc) {
        callback(doc.adbucks);
      }
    });
  },

  createAd: function(username, ad_name, ad_url, ad_src) {
    Ad.where({user: username, ad_name: ad_name, ad_url: ad_url, ad_src: ad_src}).findOne(function (err, myDocument){
      if (!myDocument) {
        var newAd = new Ad({
            user: username,
            ad_name: ad_name,
            ad_url: ad_url,
            ad_src: ad_src});
        newAd.save(function (err) {
          if (err) {
            console.log('Error creating ad!');
          } else {
            console.log('Successfully created ad');
          }
        });
      } else {
        console.log('Cannot create new ad. Already exists in this account!');
      }
    });
  },

  deleteAd: function(username, ad_name, ad_url, ad_src, callback) {
    console.log(username + "," + ad_name + "," + ad_url + "," + ad_src);
    Ad.where({user: username, ad_name: ad_name, ad_url: ad_url, ad_src: ad_src}).findOneAndRemove(function (err, myDocument, result){
      if (err) {
        console.log('Error deleting ad!');
        callback(err);
      } else {
        console.log('Ad deleted successfully');
        callback("");
      }
    });
  },

  getAds: function(username, callback) {
    Ad.find({user: username}, function (err, array) {
      callback(array);
    });
  },

  getAdsNot: function(username, callback) {
    Ad.find({user: {$ne: username}}, function (err, array) {
      callback(array);
    });
  }
};

module.exports = database;
