var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://garyliangge:NGNL2016@ds149557.mlab.com:49557/adbucks_db';

var app = express();


/* Mongo Shit */

function createAccount(username, password) {
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
}

function addAdBuck(username) {
  // Use connect method to connect to the Server
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Success! Connected to mongoDB server.');
      // increment and store adbucks 
      db.collection('Accounts').update(
        { 'user': username },
        { $inc: { 'adbucks': 1} }
      );

      db.close();
    }
  });
}

function subAdBuck(username) {
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
      );
      
      db.close();
    }
  });
}



/* Main Shit */


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

createAccount('garybear', 'gary_password');
// addAdBuck('garybear');

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
