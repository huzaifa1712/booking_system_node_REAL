var mongoose = require('mongoose');

var spaceSchema = mongoose.Schema({
  name:String,
  availableDays:[String],
  availableTimes:[String]
});

module.exports = mongoose.model('Space',spaceSchema);
