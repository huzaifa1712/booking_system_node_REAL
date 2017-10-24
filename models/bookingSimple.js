var mongoose = require('mongoose');
var moment = require('moment');
/* Referencing another Schema: https://stackoverflow.com/questions/18001478/referencing-another-schema-in-mongoose*/

var bookingSchema = mongoose.Schema({
  /*name:String,
  email:String,*/
  id:String,
  name:String,
  email:String,
  time:String,
  date:{
    startTime:Date,
    endTime:Date
  },
  space:String,
  spaceNameWithSpaces:String,
  reminder:String,
  emailSent:Boolean
});

class Booking{
  //returns bookings with that week number
  get isoWeekNum(){
    return moment(this.date.startTime).isoWeek();
  }

  get reminderInMinutes(){
    switch(this.reminder){
      case 'none':
        return 0;
        break;
      case '4h':
        return 4*60;
        break;
      case '12h':
        return 12*60;
        break;
      case '1d':
        return 24*60;
        break;
      case '1w':
        return 24*60*7;
        break;
      default:
        0;

    }
  }

  //returns bookings with certain isoWeekNumber
/*  static findBookingsByWeekNum(isoWeekNum){
    var bookingsArr = [];
    this.find({}).exec().then(function(bookings){
      bookings.forEach(function(booking){
        if(moment(booking.date.startTime).isoWeek() == isoWeekNum){
          bookingsArr.push()
        }
      })
    });
     this.find({},function(err,bookings){
    //  console.log(bookings);

      for(var i = 0; i < bookings.length;i++)
        if(moment(bookings[i].date.startTime).isoWeek() == isoWeekNum){
          console.log('yes');
          bookingsArr.push(bookings[i]);
        }

      //console.log(bookingsArr);

      //console.log("inside find:");
      //console.log(bookingsArr);
    });
    //console.log("2nd");
    //console.log("booking");
    //console.log(bookingsArr);

  }*/
}


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
bookingSchema.loadClass(Booking);

module.exports = mongoose.model('Booking',bookingSchema);
