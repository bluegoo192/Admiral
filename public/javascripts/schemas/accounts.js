var mongoose = require('mongoose');

var Account = mongoose.model('Accounts', {user : String,
  pass : String,
  adbucks : Number});

module.exports = Account;
