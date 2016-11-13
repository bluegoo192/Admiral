var mongoose = require('mongoose');

var Account = mongoose.model('Accounts', {user : String,
  pass : String,
  adbucks : Number,
  show_by_default: Boolean,
  account_id: String,
  customer_id: String
});

module.exports = Account;
