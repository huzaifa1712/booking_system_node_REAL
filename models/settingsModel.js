//The schema for settings - it just stores weeksAhead(for now). Could make it so it stores allowed reminder values too
//Created 19 Oct 2017

var mongoose = require('mongoose');
var moment = require('moment');

var settingsSchema = mongoose.Schema({
  weeksAhead:Number
});


module.exports = mongoose.model('Setting',settingsSchema);
