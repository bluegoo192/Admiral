var mongodb = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://garyliangge:NGNL2016@ds149557.mlab.com:49557/adbucks_db');
var Account = require('./schemas/accounts');
var Ad = require('./schemas/ads');
var request = require('request');

var apikey = "1d15e48ca9e6b3db7a8dc1d94b284190"; //Nessie
/* Mongo Shit */

var database = {
  createAccount: function(username, password) {
    Account.where({user:username}).findOne(function (err, myDocument){
      if (!myDocument) {
        var newAccount = new Account({
            user: username,
            pass: password,
            adbucks: 100,
            show_by_default: false});
        newAccount.save(function (err) {
          if (err) {
            console.log('Error creating account!');
          } else {
            console.log('Successfully created account');
          }
        });
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
    Account.where({user:username}).findOne(function (err, myDocument){
      if (myDocument) {
        var dollars = myDocument.adbucks / 1000.0;
        var options = {
          url: 'http://api.reimaginebanking.com/accounts/' +  myDocument.account_id + '/deposits?key=' + apikey,
          body: {
            "medium": "balance",
            "transaction_date": "2016-11-13",
            "amount": dollars,
            "description": "string"
          }
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        };

        request(options, function(error, response, body) {
          if (!error) {

          }
        })
      }
    })
  }

  showAdBucks: function (username, callback) {
    Account.where({user: username}).findOne(function (err, myDocument) {
      callback(myDocument);
    });
  },

  addAdBuck: function (username, amount, callback) {
    Account.where({user: username}).findOneAndUpdate({$inc: {'adbucks': amount}}, function(err, doc) {
      callback(doc.adbucks);
    });
  },

  subAdBuck: function(username, amount, callback) {
    Account.where({user: username}).findOneAndUpdate({$inc: {'adbucks': -1 * amount}}, function(err, doc) {
      callback(doc.adbucks);
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
