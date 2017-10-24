var mongoose = require('mongoose');
var Booking = require('./models/bookingSimple');

mongoose.connect('mongodb://localhost/bookings');
