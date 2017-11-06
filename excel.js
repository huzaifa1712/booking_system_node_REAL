var XLSX = require('xlsx');
var path = require('path');
var Booking = require('./models/booking');
var mongoose = require('mongoose');
var moment = require('moment');

//https://stackoverflow.com/questions/30859901/parse-xlsx-with-node-and-create-json

var workbook = XLSX.readFile(path.join(__dirname,'uploads/excel.xlsx'));
var sheet_name_list = workbook.SheetNames;
var bookings = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
console.log(bookings[0]);

function generateBookingFields(booking){
  //replace spaces from Excel and construct time string e.g '12:45PM-1:15PM'
  var time = booking.startTime.replace(/\s+/g, '') + '-' + booking.endTime.replace(/\s+/g, '');
  //get moment object from day String

  //create timestrings to create moments from
  var startTimeString = booking.day + "-" +  booking.startTime.replace(/\s+/g, '');
  var endTimeString = booking.day + "-" +  booking.endTime.replace(/\s+/g, '');

  //create startTime and endTime Date objects
  var startTime = moment(startTimeString, "D-MMM-YY-hh:mma").toDate();
  var endTime = moment(endTimeString, "D-MMM-YY-hh:mma").toDate();

  return {
    time:time,
    startTime:startTime,
    endTime:endTime
  }

}

function createBooking(booking){
  var timeFields = generateBookingFields(booking);

  var newBooking = new Booking();

  newBooking.name = booking.name;
  newBooking.email = booking.email;
  newBooking.time = timeFields.time;
  newBooking.date.startTime = timeFields.startTime;
  newBooking.date.endTime = timeFields.endTime;
  newBooking.space = booking.space.replace(/\s+/g, '');
  newBooking.reminder = booking.reminder;
  newBooking.emailSent = false;

  newBooking.save(function(err){
    if(err){
      throw err;
    }
  });

}



mongoose.connect('mongodb://localhost/bookings');

bookings.forEach((booking)=>{
  createBooking(booking);
});
/*
  user_id: don't set,
  name: set,
  email:set,
  time:set,(constructed)
  date:{
    startTime:set,(constructed)
    endTime:set(constructed)
 },
 space:set,
 spaceNameWithSpaces:don't set,
 reminder:set,
 emailSent:set(just set false)
*/
//console.log(workbook.Strings[1]);
