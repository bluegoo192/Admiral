var mongodb = require('mongodb');
var mongoose = require('mongoose');
var Account = require('../../models/user');
var Ad = require('../../models/ads');
var request = require('request');
var url = require('url');
var http = require('http');
var https = require('https');
var sizeOf = require('image-size');

var apikey = "1d15e48ca9e6b3db7a8dc1d94b284190"; //Nessie
/* Mongo Shit */

var database = {
  createAccount: function(user, password, callback) {
    var success = false;
    Account.where({_id: user._id}).findOne(function (err, myDocument){
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
                    account__id: JSON.parse(body2).objectCreated._id,
                    customer__id: JSON.parse(body).objectCreated._id
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

  accountExists: function(user, password, callback) {
    var equals = false;
    Account.where({_id: user._id}).findOne(function (err, myDocument){
      if (myDocument) {
        console.log("Account exists!!!");
        equals = true;
      } else {
        console.log("Account DOES NOT exists.");
      }
      callback(equals);
    });
  },

  transferAdBucks: function (user, callback) {
    Account.where({_id: user._id}).findOneAndUpdate({'adbucks': 0}, function (err, myDocument){
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

  showDollars: function(user, callback) {
    Account.where({_id: user._id}).findOne(function (err, myDocument) {
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

  showAdBucks: function (user, callback) {
    Account.where({_id: user._id}).findOne(function (err, myDocument) {
      callback(myDocument);
    });
  },

  addAdBuck: function (id, amount, callback) {
    Account.where({_id: id}).findOneAndUpdate({$inc: {'adbucks': amount}}, function(err, doc) {
      if (doc) {
        callback(doc.adbucks);
      }
    });
  },

  subAdBuck: function(id, amount, callback) {
    Account.where({_id: id}).findOneAndUpdate({$inc: {'adbucks': -1 * amount}}, function(err, doc) {
      if (doc) {
        callback(doc.adbucks);
      }
    });
  },

  createAd: function(user, ad_name, ad_url, ad_src, usesJavascript, callback) {
    Ad.where({ownerId:user._id, ad_name: ad_name, ad_url: ad_url, ad_src: ad_src}).findOne(function (err, myDocument){
      if (!myDocument) {
        var options = url.parse(ad_url);
        if(ad_url.indexOf("https") == 0) {
          https.get(options, function (response) {
            var chunks = [];
            response.on('data', function (chunk) {
              chunks.push(chunk);
            }).on('end', function() {
              var buffer = Buffer.concat(chunks);
              var dimensions = sizeOf(buffer);
              var newAd = new Ad({
                  ownerId: user._id,
                  ad_name: ad_name,
                  ad_url: ad_url,
                  ad_src: ad_src,
                  ad_height: dimensions.height,
                  ad_width: dimensions.width,
                  rating: 8,
                  reports: 0,
                  disabled: false,
                  category: "all",
                  javascript: usesJavascript,
                  sizeKB: 1
                });
              newAd.save(function (err) {
                if (err) {
                  console.log('Error creating ad!');
                } else {
                  console.log('Successfully created ad');
                }
                callback();
              });
            });
          });
        } else if (ad_url.indexOf("http") == 0) {
          http.get(options, function (response) {
            var chunks = [];
            response.on('data', function (chunk) {
              chunks.push(chunk);
            }).on('end', function() {
              var buffer = Buffer.concat(chunks);
              var dimensions = sizeOf(buffer);
              var newAd = new Ad({
                  ownerId: user._id,
                  ad_name: ad_name,
                  ad_url: ad_url,
                  ad_src: ad_src,
                  ad_height: dimensions.height,
                  ad_width: dimensions.width,
                  rating: 8,
                  reports: 0,
                  disabled: false,
                  category: "all",
                  javascript: usesJavascript,
                  sizeKB: 1
                });
              newAd.save(function (err) {
                if (err) {
                  console.log('Error creating ad!');
                } else {
                  console.log('Successfully created ad');
                }
                callback();
              });
            });
          });
        } else {
          console.log('Error creating ad. Ad_Url not valid.');
        }
      } else {
        console.log('Cannot create new ad. Already exists in this account!');
      }
    });
  },

  deleteAd: function(user, ad_name, ad_url, ad_src, callback) {
    Ad.where({ownerId: user._id, ad_name: ad_name, ad_url: ad_url, ad_src: ad_src}).findOneAndRemove(function (err, myDocument, result){
      if (err) {
        console.log('Error deleting ad!');
        callback(err);
      } else {
        console.log('Ad deleted successfully');
        callback("");
      }
    });
  },

  getAds: function(user, callback) {
    Ad.find({ownerId: user._id}, function (err, array) {
      callback(array);
    });
  },

  getAdsNot: function(user, height, width, callback) {
    console.log("getting ads not " + user + ", " + height + ", " + width);
    if (user) {
      Ad.find({ownerId: {$ne: user._id}, ad_height: height, ad_width: width}, function (err, array) {
        callback(array);
      });
    } else {
      Ad.find({ad_height: height, ad_width: width}, function (err, array) {
        callback(array);
      });
    }
  }
};

module.exports = database;
