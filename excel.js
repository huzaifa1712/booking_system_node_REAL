var XLSX = require('xlsx');
var path = require('path');
var Booking = require('./models/booking');
var mongoose = require('mongoose');
var moment = require('moment');

var reminderArray = ["none", "4h","12h","1d","1w"];

var workbook = XLSX.readFile(path.join(__dirname,'uploads/excel.xlsx'));
var bookings = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
var sheet_name_list = workbook.SheetNames;

//https://stackoverflow.com/questions/37733966/get-the-given-date-format-the-string-specifying-the-format-in-javascript-or-mo
//Above link is for specifying multiple different possible time parser formats
//https://stackoverflow.com/questions/30859901/parse-xlsx-with-node-and-create-json


//https://github.com/SheetJS/js-xlsx/issues/214 - For get_header_row

//returns the headers without the unknowns.
function getHeaders(workbook) {
    var headers = [];
    var sheet = workbook.Sheets.Sheet1
    var range = XLSX.utils.decode_range(sheet['!ref']);

    var C, R = range.s.r; /* start in the first row */
    /* walk every column in the range */
    for(C = range.s.c; C <= range.e.c; ++C) {
        var cell = sheet[XLSX.utils.encode_cell({c:C, r:R})] /* find the cell in the first row */

        var hdr = "UNKNOWN " + C; // <-- replace with your desired default
        if(cell && cell.t) hdr = XLSX.utils.format_cell(cell);

        headers.push(hdr);
    }

    //returns headers row without 'unknown'
    headers = headers.filter(function(header){
      return !header.includes('UNKNOWN');
    });
    return headers;
}

//generates the time fields, such as the time string and startTime and endTime date objects
//Note: VARIABLE ACCESSIBILITY DEPENDS ON NAME OF HEADER IN THE ROW
function generateTimeFields(booking){
  //replace spaces from Excel and construct time string e.g '12:45pm-1:15pm' make times lowecase so PM/pm and am/AM doesn't matter
  var time = booking.startTime.replace(/\s+/g, '').toLowerCase() + '-' + booking.endTime.replace(/\s+/g, '').toLowerCase();
  //get moment object from day String

  //create timestrings to create moments from - make times lowecase so PM/pm and am/AM doesn't matter
  var startTimeString = booking.date + "-" +  booking.startTime.replace(/\s+/g, '').toLowerCase();
  var endTimeString = booking.date + "-" +  booking.endTime.replace(/\s+/g, '').toLowerCase();

  //create startTime and endTime Date objects
  console.log(moment(startTimeString,"D-MMM-YY-hh:mma"));
  var startTime = moment(startTimeString, "D-MMM-YY-hh:mma").toDate();
  var endTime = moment(endTimeString, "D-MMM-YY-hh:mma").toDate();

  return {
    time:time,
    startTime:startTime,
    endTime:endTime
  }

}

//Create a booking from the array received from excel
//Note: VARIABLE ACCESSIBILITY DEPENDS ON NAME OF HEADER IN THE ROW
function createAndSaveBooking(booking){
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



//mongoose.connect('mongodb://localhost/bookings');

//checks if there are any blank fields for the row for that booking.
//Returns false if no missing properties.
function missingProps(booking){
  var headers = getHeaders(workbook);

  var missingProp = false;
  headers.forEach((header)=>{
    if(!booking.hasOwnProperty(header)){
      missingProp = true;
    }
  });

  return missingProp;
}

/*
1. Each row must be complete - no blanks in each space. if there is a row with complete blanks, skip it.
2. Email must end with @gapps.uwcsea.edu.sg
3. If invalid date, catch the error and tell the admin. Format is in D-MMM-YY
4. If invalid time, catch error and tell admin. Format is 12 hour, hh:mma
5. Check that reminder option is one of the allowed. 'None' and blank are same.
*/
function validateBookingFields(booking){
  var isErr = false;
  var errorCode = 0;

  //1.Each row must not have blanks.
  //check if the booking is missing props.
  if(missingProps(booking)){
    //errorMsg = errorMsg + "No fields for each booking are blank\n\n";
    errorCode = 1;
    isErr = true;
  }

  else{
    //2. Email must end with @gapps.uwcsea.edu.sg
    if(!booking.email.endsWith('@gapps.uwcsea.edu.sg')){
      //errorMsg = errorMsg + "The e-mail for each booking is a UWCSEA email address.\n\n"
      errorCode = 2;
      isErr = true;
    }

    //3 and 4 - doesn't really work
    try{
      var timeFields = generateTimeFields(booking);
    }

    catch(e){
      var isErr = true;
      //var errorMsg = errorMsg + "The date is in the format D-MMM-YY e.g 7-Nov-17, and times are 12 hour and hh:mma, e.g 1:45pm\n\n"
      errorCode = 3;
    }

    //5.Check reminder options
    var reminder = booking.reminder.toLowerCase().replace(/\s+/g, '');
    if(reminderArray.indexOf(reminder) == -1){
      isErr = true;
      //errorMsg = errorMsg + "The reminder option is either of: " + reminderArray.join(',');
      errorCode = 4;
    }
  }

  return{
    isErr:isErr,
    errorCode:errorCode
  }
}

function returnErrorMsg(errorCodes){
  var errorMsg = "ERROR: Ensure the following are done:\n\n"
  var errorMessages = {
    1:"No fields for each booking are blank\n\n",
    2:"The e-mail for each booking is a UWCSEA email address.\n\n",
    3:"The date is in the format D-MMM-YY e.g 7-Nov-17, and times are 12 hour and hh:mma, e.g 1:45pm\n\n",
    4:"The reminder option is either of: " + reminderArray.join(',')
  }

  errorCodes.forEach((errorCode)=>{
    errorMsg = errorMsg + errorMessages[errorCode];
  });

  return errorMsg;
}






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
