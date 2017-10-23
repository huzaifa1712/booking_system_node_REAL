
//make a function that outputs if a booking is now or not, based on the startDate given
var moment = require('moment');
var mongoose = require('mongoose');
//testDate stores example startDate that you'd have for a booking
var Booking = require('./models/bookingSimple');
var Mail = require('./mail');
let account = require('./config/email_user');


var MailObj = new Mail(account.user,account.pass);
MailObj.sendMail('windowpane1712@gmail.com','TESTMAIL','<h1> Mail </h1>');
mongoose.connect('mongodb://localhost/bookings');


function startAndEndTimes(day,times,isoWeekNum,year){
  var isoWeekDay = moment(day,"dddd").isoWeekday();
  var startTimeString = isoWeekDay + "-" + times[0] + "-" + isoWeekNum + "-" + year;
  var endTimeString =  isoWeekDay + "-" + times[1] + "-" + isoWeekNum + "-" + year;

  var startDate = moment(startTimeString, "E-hh:mma-WW-YYYY");
  console.log(startDate.format("E-hh:mma-WW-YYYY"));
  var endDate = moment(endTimeString, "E-hh:mma-WW-YYYY");
  console.log(endDate.format("E-hh:mma-WW-YYYY"));

  return {
    startDate:startDate.toDate(),
    endDate:endDate.toDate()
  }
}

var day = "Monday";
var times = ["1:32pm","12:50am"];
var isoWeekNum = moment().isoWeek();
var year = "2017";

var times = startAndEndTimes(day,times,isoWeekNum,year);
console.log("Monent of booking: " + moment(times.startDate).format("E-hh:mma-DD-MM-WW-YYYY"));

function momentToSend(startDate,reminderInMinutes){
  var reminderInSeconds = reminderInMinutes*60;
  var secondsOfDate = moment(startDate).seconds();
  var momentToSendAt = moment(startDate).seconds(secondsOfDate - reminderInSeconds);

  return momentToSendAt;
}

var momentToSendAt = momentToSend(times.startDate, 1);

console.log("Moment to send at: " + momentToSendAt.format("E-hh:mma-DD-MM-WW-YYYY"));

function shouldSendReminder(startDate,reminderInMinutes){
  var momentToSendAt = momentToSend(startDate,reminderInMinutes);
  console.log("Moment to send: " + momentToSendAt.format("E-hh:mma-DD-MM-WW-YYYY"));
  var bookingIsNow = false;

  if(momentToSendAt.isSame(moment(),'second')){
    bookingIsNow = true;
  }

  return bookingIsNow;
}

console.log(shouldSendReminder(momentToSendAt));

Booking.find({},function(err,bookings){
  if(err){
    throw err;
  }

  else{
    for(var i = 0; i < bookings.length; i++){
      var startMoment = moment(bookings[i].date.startTime);
      console.log("Start date: " + startMoment.format("E-hh:mma-DD-MM-WW-YYYY"));
      var reminderInMinutes = bookings[i].reminderInMinutes;
      console.log("Reminder in min: " + bookings[i].reminderInMinutes);

      console.log(shouldSendReminder(startMoment,reminderInMinutes));
    }
  }
});

/*
setInterval(function(){
  console.log(moment(times.startDate).format("E-hh:mma-DD-MM-WW-YYYY"));
  console.log(momentToSendAt.format("E-hh:mma-DD-MM-WW-YYYY"));
  console.log(sendReminder(momentToSendAt));

},1000);*/
