var days = require('../days.js');
var mongoose = require('mongoose');

/*
Number of rows: corresponds to length of timesArray from function
Number of heads: corresponds to length of days array

*/
var settingsSchema = mongoose.Schema({
  times: [String],
  days: [String],
  weeksAhead:Number,

});


module.exports = mongoose.model('Settings', settingsSchema);

//console.log(settings.days);

//prints the times. e.g 12:45 - 1:15, 1:15 - 1:45
