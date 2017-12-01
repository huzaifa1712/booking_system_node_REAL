//The space Schema, along with a couple of methods added on later.
//Created 7 Sep 2017
var mongoose = require('mongoose');

var spaceSchema = mongoose.Schema({
  name:String,
  days:[String],
  times:[{
    start:String,
    end:String
  }]
});

//returns an array of the times used to populate the schedule
spaceSchema.virtual('returnTimes').get(function(){
  var returnArray = [];
  for(var i = 0; i < this.times.length; i++){
    returnArray.push(this.times[i].start + " - " + this.times[i].end);
  }

  return returnArray;
});


//Static method that returns array of objects with id and space name for each space
//document. Uses 'projection': the 'name' in quotes refers to the property we are retrieving.
spaceSchema.statics.getSpaceNames = function getSpaceNames(cb){
  return this.model('Space').find({},'name',cb);
};

module.exports = mongoose.model('Space',spaceSchema);
