var mongoose = require('mongoose');
var Booking = require('./models/bookingSimple');

mongoose.connect('mongodb://localhost/bookings');
var id = "59ef3a13a18c7f08440d9179";
Booking.findById(id,function(err,doc){
  doc.remove();
});
