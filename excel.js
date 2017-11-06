var XLSX = require('xlsx');
var path = require('path');
var Booking = require('./models/booking');
var mongoose = require('mongoose');
var moment = require('moment');

//https://stackoverflow.com/questions/37733966/get-the-given-date-format-the-string-specifying-the-format-in-javascript-or-mo
//Above link is for specifying multiple different possible time parser formats
//https://stackoverflow.com/questions/30859901/parse-xlsx-with-node-and-create-json

var workbook = XLSX.readFile(path.join(__dirname,'uploads/excel.xlsx'));
var sheet_name_list = workbook.SheetNames;
//this line of code gets an array where each element corresponds to one row of the
//workbook
var bookings = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
console.log(bookings[0]);

function generateTimeFields(booking){
  //replace spaces from Excel and construct time string e.g '12:45pm-1:15pm' make times lowecase so PM/pm and am/AM doesn't matter
  var time = booking.startTime.replace(/\s+/g, '').toLowerCase() + '-' + booking.endTime.replace(/\s+/g, '').toLowerCase();
  //get moment object from day String

  //create timestrings to create moments from - make times lowecase so PM/pm and am/AM doesn't matter
  var startTimeString = booking.day + "-" +  booking.startTime.replace(/\s+/g, '').toLowerCase();
  var endTimeString = booking.day + "-" +  booking.endTime.replace(/\s+/g, '').toLowerCase();

  //create startTime and endTime Date objects
  var startTime = moment(startTimeString, "D-MMM-YY-hh:mma").toDate();
  var endTime = moment(endTimeString, "D-MMM-YY-hh:mma").toDate();

  return {
    time:time,
    startTime:startTime,
    endTime:endTime
  }

}

/*
1. Each row must be complete - no blanks in each space. if there is a row with complete blanks, skip it.
2. Email must end with @gapps.uwcsea.edu.sg
3. If invalid date, catch the error and tell the admin.
4. Check that reminder option is one of the allowed. 'None' and blank are same.
*/
function validateBookingFields(booking){

}

function createBooking(booking){
  var timeFields = generateTimeFields(booking);

  var newBooking = new Booking();

  newBooking.name = booking.name;
  newBooking.email = booking.email.replace(/\s+/g, '');
  newBooking.time = timeFields.time;
  newBooking.date.startTime = timeFields.startTime;
  newBooking.date.endTime = timeFields.endTime;
  newBooking.space = booking.space.replace(/\s+/g, '');
  newBooking.spaceNameWithSpaces = booking.space + " ";
  newBooking.reminder = booking.reminder.replace(/\s+/g, '');
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
