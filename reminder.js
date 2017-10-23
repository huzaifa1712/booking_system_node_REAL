
//make a function that outputs if a booking is now or not, based on the startDate given
var moment = require('moment');
var mongoose = require('mongoose');
//testDate stores example startDate that you'd have for a booking
var Booking = require('./models/bookingSimple');
var Mail = require('./mail');
let account = require('./config/email_user');


var MailObj = new Mail(account.user,account.pass);
//MailObj.sendMail('windowpane1712@gmail.com','TESTMAIL','<h1> Mail </h1>');
mongoose.connect('mongodb://localhost/bookings');

//console.log("Monent of booking: " + moment(times.startDate).format("E-hh:mma-DD-MM-WW-YYYY"));

//Takes the startDate of the booking and reminder in minutes, returns
//the moment object at which we need to send the e-mail for this
function momentToSend(startDate,reminderInMinutes){
  var reminderInSeconds = reminderInMinutes*60;
  var secondsOfDate = moment(startDate).seconds();
  var momentToSendAt = moment(startDate).seconds(secondsOfDate - reminderInSeconds);

  return momentToSendAt;
}


//console.log("Moment to send at: " + momentToSendAt.format("E-hh:mma-DD-MM-WW-YYYY"));

//outputs whether or not a reminder should be sent right now(true/false), given booking startDate and
//reminder in minutes
function shouldSendReminder(startDate,reminderInMinutes){
  var momentToSendAt = momentToSend(startDate,reminderInMinutes);
  //console.log("Moment to send: " + momentToSendAt.format("E-hh:mma-DD-MM-WW-YYYY"));
  var bookingIsNow = false;

  if(momentToSendAt.isSame(moment(),'second')){
    bookingIsNow = true;
  }

  return bookingIsNow;
}

//sends the reminder email given a bookingObject. Creates email string and sends using
//the MailObj
function sendReminderEmail(bookingObject){
  var firstName = bookingObject.user.name;
  var spaceName = bookingObject.spaceNameWithSpaces;
  var startDate = moment(bookingObject.date.startTime).format("dddd Do MMMM");
  var startTime = moment(bookingObject.date.startTime).format("h:mma");

  var emailAddress = bookingObject.user.email;
  var subjectString = "IDEAS Hub Booking";

  var emailString =
    "<p>Dear " + firstName + "," + "<br>"
    + "Your booking for " + spaceName + "is on " + startDate + " at " + startTime
    +"." +  "<br><br>" + "Kind regards," + "<br>" + "IDEAS Hub"
    + "<br><br>" + "Note: This is an automated e-mail. Please do not reply.</p>";

  MailObj.sendMail(emailAddress,subjectString,emailString);
}

//console.log(shouldSendReminder(momentToSendAt));

//this is the main function. Loops through all the bookings and checks whether
//an email should be sent. If yes, sends the email.
function checkBookingsAndSendEmails(){
  Booking.find({},function(err,bookings){
    console.log('running');
    if(err){
      throw err;
    }

    else{
      for(var i = 0; i < bookings.length; i++){
        var startMoment = moment(bookings[i].date.startTime);
        //console.log("Start date: " + startMoment.format("E-hh:mma-DD-MM-WW-YYYY"));
        var reminderInMinutes = bookings[i].reminderInMinutes;
        //console.log("Reminder in min: " + bookings[i].reminderInMinutes);
        //console.log(bookings[i].spaceNameWithSpaces);
        if(shouldSendReminder(startMoment,reminderInMinutes)){
          sendReminderEmail(bookings[i]);
        }
        //var email = bookings[i].user.email;
      }
    }
  });
}

checkBookingsAndSendEmails();


/*
    var query = {
      "id":mongoose.Schema.Types.ObjectId("59ed9b529d050aaf4da52a2e")
    }

    var update = {
      "emailSent":false
    }


    Booking.update(query,update,{multi:true},function(err,numAffected){
      if(err){
        throw err;
      }

      else{
        console.log(numAffected);
      }
    });*/


/*
var idString = "59ed9b569d050aaf4da52a2f" ;
console.log(idString);
var query = {
  "id":mongoose.Schema.Types.ObjectId("59ed9b569d050aaf4da52a2f")
}

var update = {
  "emailSent":true
}

Booking.update(query,update,function(err,numAffected){
  if(err){
    throw err;
  }

  else{
    console.log(numAffected);
  }
});*/
/*
setInterval(function(){
  console.log(moment(times.startDate).format("E-hh:mma-DD-MM-WW-YYYY"));
  console.log(momentToSendAt.format("E-hh:mma-DD-MM-WW-YYYY"));
  console.log(sendReminder(momentToSendAt));

},1000);*/
