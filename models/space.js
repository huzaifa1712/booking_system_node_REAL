var mongoose = require('mongoose');

var spaceSchema = mongoose.Schema({
  name:String,
  days:[String],
  times:[String]
});

module.exports = mongoose.model('Space',spaceSchema);
