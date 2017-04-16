var mongoose = require('mongoose');

var Ad = mongoose.model('Ad', {
  ownerId : String,
  ad_name : String,
  ad_url : String,
  ad_src: String,
  ad_height: Number,
  ad_width: Number,
  rating: Number,
  reports: Number,
  disabled: Boolean,
  category: String,
  javascript: Boolean,
  sizeKB: Number
  });

module.exports = Ad;
