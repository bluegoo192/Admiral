var mongodb = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://garyliangge:NGNL2016@ds149557.mlab.com:49557/adbucks_db');
var Account = require('./schemas/accounts');
var Ad = require('./schemas/ads');
var MongoClient = mongodb.MongoClient;
// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://garyliangge:NGNL2016@ds149557.mlab.com:49557/adbucks_db';

/* Mongo Shit */

var database = {
  createAccount: function(username, password) {
    Account.where({user:username}).findOne(function (err, myDocument){
      if (!myDocument) {
        var newAccount = new Account({
            user: username,
            pass: password,
            adbucks: 100});
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

  showAdBucks: function (username, callback) {
    Account.where({user: username}).findOne(function (err, myDocument) {
      callback(myDocument.adbucks);
    });
  },


  addAdBuck: function (username, callback) {
    Account.where({user: username}).findOneAndUpdate({$inc: {'adbucks': 2}}, function(err, doc) {
      callback(doc.adbucks);
    });
  },

  subAdBuck: function(username, callback) {
    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        console.log('Success! Connected to mongoDB server.');
        // decrement and store adbucks
        db.collection('Accounts').update(
          { 'user': username },
          { $inc: { 'adbucks': -1} }
        ).then(function(myDocument) {
          database.showAdBucks(username, callback);
        });;

        db.close();
      }
    });
  },

  createAd: function(username, ad_name, ad_url) {
    // Use connect method to connect to the Server
    var success = false;
    MongoClient.connect(url, function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        console.log('Success! Connected to mongoDB server.');
        // do some work here with the database.
        db.collection('Ads').find({'user': username, 'ad_name': ad_name, 'ad_url': ad_url}).count().then(function(count) {
          if (count == 0) {
            db.collection('Ads').insertOne({
              user : username,
              ad_name: ad_name,
              ad_url: ad_url
            });
            success = true;
          } else {
            console.log('Cannot create new ad. Already exists in this account!')
          }

          db.close();
          return success;
        });
      }
    });
  },

  deleteAd: function(username, ad_url) {
    // Use connect method to connect to the Server
    var success = false;
    MongoClient.connect(url, function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        console.log('Success! Connected to mongoDB server.');
        // do some work here with the database.
        db.collection('Ads').remove({'user': username, 'ad_name': ad_name, 'ad_url': ad_url}, true).then(function(thing) {
          console.log(thing);
        });
        db.close();
        return success;
      }
    });
  },

  getAds: function(username, callback) {
    var success = false;
    MongoClient.connect(url, function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        console.log('Success! Connected to mongoDB server.');
        // do some work here with the database.
        var cursor = db.collection('Ads').find({'user': username}).toArray(function(array){
          console.log(array);
        });
        var array = [];
        // while(cursor.hasNext()) {
        //   var myDocument = cursor.next();
        //   array.push({
        //     ad_name: myDocument.ad_name,
        //     ad_url: myDocument.ad_url
        //   });
        // }
        console.log(array);
        callback(array);
        db.close();
        return success;
      }
    });
  }
};

module.exports = database;
