var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
  id: String,
  username: String,
  password: String,
  siteAddress: String,
  billingCode: String,
  adbucks: Number,
  show_by_default: Boolean,
  account_id: String,
  customer_id: String
});
