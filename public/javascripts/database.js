var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://garyliangge:NGNL2016@ds149557.mlab.com:49557/adbucks_db';


/* Mongo Shit */

var database = {
  createAccount: function(username, password) {
    // Use connect method to connect to the Server
    var success = false;
    MongoClient.connect(url, function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        console.log('Success! Connected to mongoDB server.');
        // do some work here with the database.
        if (db.collection('Accounts').find({'user': username}).count() == 0) {
          db.collection('Accounts').insertOne({
            user : username,
            pass : password,
            adbucks : 100
          });
          success = true;
        } else {
          console.log('Cannot create new account: Username already exists!')
        }

        db.close();
        return success;
      }
    });
  },

  showAdBucks: function (username, callback) {
    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        console.log('Success! Connected to mongoDB server.');
        // increment and store adbucks
        var myDocument = db.collection('Accounts').findOne(
          { user: username },
          { adbucks: 1 }
        ).then(function(myDocument) {
          callback(myDocument.adbucks);
        });
        db.close();
      }
    });
  },


  addAdBuck: function (username, callback) {
    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        console.log('Success! Connected to mongoDB server.');
        // increment and store adbucks
        db.collection('Accounts').update(
          { 'user': username },
          { $inc: { 'adbucks': 2} }
        ).then(function(myDocument) {
          database.showAdBucks(username, callback);
        });

        db.close();
      }
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
  }
};

module.exports = database;
