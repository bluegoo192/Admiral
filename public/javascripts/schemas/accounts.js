var mongoose = require('mongoose');

var Account = mongoose.model('Accounts', {user : String,
  pass : String,
  adbucks : Number,
  show_by_default: Boolean
});

module.exports = Account;
