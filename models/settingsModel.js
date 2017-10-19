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

//a virtual is a property that does not get persisted to the DB. Can call this property in code
//have set this prop to the result of the returnTimes function so we can have
//one property for the times and another for the thing to display in the table
settingsSchema.virtual('returnTimes').get(function(){
  var returnArray = [];
  for(var i = 0; i < this.times.length-1; i++){
    returnArray.push(this.times[i] + " - " + this.times[i+1]);
  }

  return returnArray;
});

var Settings = mongoose.model('Settings', settingsSchema);
var s = new Settings({
  times:["12:45","1:15","1:45","2:15","2:45"],
  days:[days.MONDAY,days.TUESDAY,days.WEDNESDAY,days.THURSDAY,days.FRIDAY],
  weeksAhead:4
});

console.log(s.returnTimes[0]);

//console.log(settings.days);

//prints the times. e.g 12:45 - 1:15, 1:15 - 1:45
