var mongoose = require('mongoose');

var spaceSchema = mongoose.Schema({
  name:String,
  days:[String],
  times:[String]
});

spaceSchema.virtual('returnTimes').get(function(){
  var returnArray = [];
  for(var i = 0; i < this.times.length-1; i++){
    returnArray.push(this.times[i] + " - " + this.times[i+1]);
  }

  return returnArray;
});

module.exports = mongoose.model('Space',spaceSchema);

/*
var Space = mongoose.model('Space',spaceSchema);

var space1 = new Space({
  name:'Green Screen Room 1',
  days:["Monday","Tuesday","Wednesday","Thursday","Friday"],
  times:["12:45pm","1:15pm","1:45pm","2:15pm","2:45pm"]
});


var space2 = new Space({
  name:'Green Screen Room 2',
  days:["Monday","Tuesday","Wednesday","Thursday"],
  times:["12:45pm","1:15pm","1:45pm","2:15pm"]
});

/*
mongoose.connect('mongodb://localhost/bookings');


space1.save((err)=>{
  if(err){
    throw err;
  }
});

space2.save((err)=>{
  if(err){
    throw err;
  }
});*/
