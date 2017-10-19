var days = require('../days.js');
var mongoose = require('mongoose');
var moment = require('moment');
/*
Number of rows: corresponds to length of timesArray from function
Number of heads: corresponds to length of days array
*/
var settingsSchema = mongoose.Schema({
  times: [String],
  days: [String],
  //current Week Number - can use it to get the date given a day and year
  isoWeekNumber:Number,
  weeksAhead:Number

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

settingsSchema.virtual('startAndEndOfWeek').get(function(){
  return{
    startOfWeek:moment().isoWeek(this.isoWeekNumber).weekday(1).format("MMMM DD"),
    endOfWeek:moment().isoWeek(this.isoWeekNumber).weekday(5).format("MMMM DD")
  }
});

module.exports = mongoose.model('Setting',settingsSchema);


var Setting = mongoose.model('Setting', settingsSchema);

/*
var s = new Setting({
  times:["12:45pm","1:15pm","1:45pm","2:15pm","2:45pm"],
  days:[days.MONDAY,days.TUESDAY,days.WEDNESDAY,days.THURSDAY,days.FRIDAY],
  isoWeekNumber: moment().isoWeek(),
  weeksAhead:4
});

mongoose.connect('mongodb://localhost/bookings');
s.save((err)=>{
  if(err){
    throw err;
  }


});*/





//console.log(settings.days);

//prints the times. e.g 12:45 - 1:15, 1:15 - 1:45
