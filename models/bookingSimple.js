var mongoose = require('mongoose');

/* Referencing another Schema: https://stackoverflow.com/questions/18001478/referencing-another-schema-in-mongoose*/

var bookingSchema = mongoose.Schema({
  name:String,
  email:String,
  day:String,
  time:String,

});
/*
var bookingSchema = mongoose.Schema({
  user: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }

  date: Date,
  space: String,
  hoursBefore: Number

});*/

module.exports = mongoose.model('Booking',bookingSchema);
