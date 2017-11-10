var Booking = require('./models/booking');
var Space  = require('./models/space');
var mongoose = require('mongoose');
/*
  Search through bookings based on space name
  Count the number of times each time appears.
  Select the two
*/
var spaceName = "Green Screen Room 1";

mongoose.connect('mongodb://localhost/bookings');

Booking.find(function(err,bookings){
  if(err){
    throw err;
  }

  else{
    bookings = bookings.filter(function(booking){
      return booking.space == spaceName.replace(/\s+/g, '');
      
    });
  }

  console.log(bookings);
});
