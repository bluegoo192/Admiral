var mongoose = require('mongoose');

var Ad = mongoose.model('Ad', {user : String,
  ad_name : String,
  ad_url : String});

module.exports = Ad;
