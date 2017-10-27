var mongoose = require('mongoose');

var spaceSchema = mongoose.Schema({
  name:String,
  days:[String],
  times:[{
    start:String,
    end:String
  }]
});

spaceSchema.virtual('returnTimes').get(function(){
  var returnArray = [];
  for(var i = 0; i < this.times.length; i++){
    returnArray.push(this.times[i].start + " - " + this.times[i].end);
  }

  return returnArray;
});

//Static method that returns array of objects with id and space name for each space
//document. Uses 'projection': the 'name' in quotes refers to the property we want
//to get
spaceSchema.statics.getSpaceNames = function getSpaceNames(cb){
  return this.model('Space').find({},'name',cb);
};

module.exports = mongoose.model('Space',spaceSchema);
/*
var Space = mongoose.model('Space',spaceSchema);

mongoose.connect('mongodb://localhost/bookings');

Space.find({},function(err,spaces){
  if(err){
    throw err;
  }

  else{
    spaces.forEach(function(space){
      console.log(space.returnTimes);
    });
  }
});*/

/*
Space.findOneAndUpdate({_id:"59ec8ba833d723989991426e"},{$set:{days:["Monday","Tuesday"]}},{new:true},function(err,doc){
  if(err){
    throw err;
  }

  else{
    console.log(doc);
  }
});*/

/*
var Space = mongoose.model('Space',spaceSchema);
mongoose.connect('mongodb://localhost/bookings');

var space1 = new Space({
  name:'Green Screen Room 1',
  days:["Monday","Tuesday","Wednesday","Thursday","Friday"],
  //times:["12:45pm","1:15pm","1:45pm","2:15pm","2:45pm"]
  times:[{start:"12:45pm",end:"1:15pm"},{start:"1:15pm",end:"1:45pm"},{start:"1:45pm",end:"2:15pm"},{start:"2:15pm",end:"2:45pm"}]
});

var space2 = new Space({
  name:'Green Screen Room 2',
  days:["Monday","Tuesday","Wednesday","Thursday"],
  //times:["12:45pm","1:15pm","1:45pm","2:15pm"]
  times:[{start:"12:45pm",end:"1:15pm"},{start:"1:15pm",end:"1:45pm"},{start:"1:45pm",end:"2:15pm"}]

});

space1.save((err)=>{
  if(err){
    throw err;
  }
});

space2.save((err)=>{
  if(err){
    throw err;
  }
});

/*
var space2 = new Space({
  name:'Green Screen Room 2',
  days:["Monday","Tuesday","Wednesday","Thursday"],
  //times:["12:45pm","1:15pm","1:45pm","2:15pm"]
  times:[{start:"12:45pm",end:"1:15pm"},{start:"1:15pm",end:"1:45pm"},{start:"1:45pm",end:"2:15pm"}]

});*


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
