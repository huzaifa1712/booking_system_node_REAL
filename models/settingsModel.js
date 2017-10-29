var days = require('../days.js');
var mongoose = require('mongoose');
var moment = require('moment');
/*
Number of rows: corresponds to length of timesArray from function
Number of heads: corresponds to length of days array
*/
var settingsSchema = mongoose.Schema({
  weeksAhead:Number
});

//a virtual is a property that does not get persisted to the DB. Can call this property in code
//have set this prop to the result of the returnTimes function so we can have
//one property for the times and another for the thing to display in the table

/*
settingsSchema.virtual('returnTimes').get(function(){
  var returnArray = [];
  for(var i = 0; i < this.times.length-1; i++){
    returnArray.push(this.times[i] + " - " + this.times[i+1]);
  }

  return returnArray;
});*/
/*
settingsSchema.virtual('startAndEndOfWeek').get(function(){
  //to be used for rendering e.g 'Oct 16 to Oct 20'
  //could replace weekday thing with the start and end day of the spaces
  //e.g if space goes from Tuesday to Thursday use those to generate the dates
  return{
    startOfWeek:moment().isoWeek(this.isoWeekNumber).weekday(1).format("MMMM DD"),
    endOfWeek:moment().isoWeek(this.isoWeekNumber).weekday(5).format("MMMM DD")
  }
});

settingsSchema.statics.returnTimes = function(times){
  var returnArray = [];
  for(var i = 0; i < times.length-1; i++){
    returnArray.push(times[i] + " - " + times[i+1]);
  }

  return returnArray;
}

module.exports = mongoose.model('Setting',settingsSchema);


var Setting = mongoose.model('Setting', settingsSchema);

/*spaces:[
  {
  name:'Green Screen Room 1',
  times:[String],
  days:[String]

  }
]*/
module.exports = mongoose.model('Setting',settingsSchema);

//console.log(Setting.retTimes(["12:45pm","1:15pm","1:45pm","2:15pm","2:45pm"]));


/*mongoose.connect('mongodb://localhost/bookings');
Setting.findOneAndUpdate({_id:"59f45f5943f5346a3e0d4a0d"},{$set:{weeksAhead:5}},{new:true},function(err,setting){
  if(err){
    throw err;
  }

  else{
    console.log(setting);
  }
});*/



//console.log(settings.days);

//prints the times. e.g 12:45 - 1:15, 1:15 - 1:45
