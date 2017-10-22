let express = require('express');
let path = require('path');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let expressValidator = require('express-validator');
let flash = require('connect-flash');
let session = require('express-session');
let config = require('./config/database');
var passport = require('passport');
require('./config/passport.js')(passport)
//var settings = require('./setting.js');
var fs = require('fs');

var Booking = require('./models/bookingSimple');
var Setting = require('./models/settingsModel')
var moment = require('moment');

var app = express();

  mongoose.connect(config.url);
  db = mongoose.connection;

  //Check connection
  db.once('open',()=>{
    console.log('Connected to mongoDB');
  });

  //check for errors in DB
  db.on('error',(err)=>{
    throw err;
  });

app.set('views', path.join(__dirname,'views'));
app.set('view engine','pug');

//MIDDLEWARES
  app.use(express.static(path.join(__dirname,'public'))); //static assets
  app.use(session({ //session middleware
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  }))

  app.use(require('connect-flash')()); //messages and flash middleware
  app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
  });

  app.use(expressValidator()); //validator middleware

  app.use(passport.initialize()); //passport middleware
  app.use(passport.session());
  var urlencodedParser = bodyParser.urlencoded({extended:false}); //bodyParser for POST

//Routes

//Google routes(login)
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile','email']
  }));

  //This is a callback that executes after login is done.
  app.get('/auth/google/callback',passport.authenticate('google',{
    //redirect to 'profile' if succeeded in logging in, if not go to index
    successRedirect: '/account_page',
    failureRedirect: '/',
    failureFlash:true
  }))

//normal routes
app.get('/',(req,res)=>{
  //USES SETTINGS
  Setting.find(function(err,settings){
    if(err){
      throw err;
    }

    else{
      //console.log(settings);
      //console.log(settings[0].days);
      //console.log(settings[0].returnTimes);
      //var startAndEnd = settings[0].startAndEndOfWeek;
      //console.log(settings[0].returnTimes);
      console.log(settings[0].spaces);
      res.render('index',{
        //TODO:replace with call to db for settings
        //EVERY PAGE WITH A BOOKINGS TABLE NEEDS TO LOAD SETTINGS
        days:settings[0].days,
        times:settings[0].returnTimes,
        spaces:settings[0].spaces
        //startAndEnd:startAndEnd
      });

    }
  });
});

app.get('/account_page',isLoggedIn, (req,res)=>{
  //USES SETTINGS
  Setting.find(function(err,settings){

    if(err){
      throw err;
    }

    else{
      //var startAndEnd = settings[0].startAndEndOfWeek;
      //console.log(settings[0].returnTimes);
      res.render('account_page',{
        //TODO:replace with call to db for settings
        //EVERY PAGE WITH A BOOKINGS TABLE NEEDS TO LOAD SETTINGS
        user:req.user,
        days:settings[0].days,
        times:settings[0].returnTimes,
        spaces:settings[0].spaces
        //startAndEnd:startAndEnd

      });
    }
  });
});

//Unnecessary - remove it later
app.get('/bookings_table',(req,res)=>{

});

//test for getting bookings from the database
//Unnecessary - remove it later
app.get('/test_bookings_get',(req,res)=>{
  Booking.find(function(err,bookings){
    if(err){
      throw err;
    }

    else{
      console.log(bookings);
    }
  });


  });

//populate bookings uses this route to get the bookings and populate the table
app.get('/bookings/:isoWeekNum',(req,res)=>{
//call to db for bookings
//var bookingsArray = [];

//returns bookings only with that isoWeekNum
//TODO: make it so that it returns based on Space AND isoWeekNum once spaces
//are being implemented
Booking.find(function(err,bookings){
  if(err){
    throw err;
  }

  else{
    //console.log("Booking variable");
    var bookingsArr = bookings.filter(function(booking){
      return moment(booking.date.startTime).isoWeek() == req.params.isoWeekNum;
    });
    res.json(JSON.stringify(bookingsArr));
  }
});


  /*var bookings = [
    {
      name:'Jeff',
      time: '12:45-1:15',
      day:'Monday'
    },
    {
      name:'Carl',
      time: '1:15-1:45',
      day:'Wednesday'
    },

    {
      name:'John',
      time: '1:15-1:45',
      day:'Thursday'
    }

  ];
//if we are sending it as JSON string, we will have to parse it on the
//jQuery side before being able to access anything.
  res.json(JSON.stringify(bookings));*/
});

//this route takes the Booking information and saves it
app.post('/make_booking', urlencodedParser, (req,res)=>{
  //console.log('lol');
  console.log(req.body);
  console.log(req.body.timeString);
  console.log(req.body.startTime);
  console.log(req.body.endTime);
  //console.log(req.body.day);
  //console.log(req.body.time);
  //console.log(req.body.user.email);
  //req.flash('success','Booking made!');
  //res.redirect('/account_page');

  //check if req object empty

    var newBooking = new Booking();
    newBooking.user.id = req.body.id;
    newBooking.user.name = req.body.name;
    newBooking.user.email = req.body.email;
    newBooking.time = req.body.timeString;
    newBooking.date.startTime = req.body.startTime;
    newBooking.date.endTime = req.body.endTime;
    newBooking.reminder = req.body.reminder;
    newBooking.space = req.body.space;
    console.log(newBooking);
    //console.log("Booking isoWeekNum: " + newBooking.isoWeekNum);

    newBooking.save((err)=>{
      if(err){
        throw err;
      }

      else{
        console.log("Booking saved");
        //res.redirect('/');
      }
    });


});

//a route that sends back a user JSON object which can be used when making bookings
app.get('/get_user', isLoggedIn,(req,res)=>{
  console.log("User body: ");
  console.log(req.user);

  res.json(req.user);
});

//returns the maximum week number
app.get('/maxWeekNum', (req,res)=>{
  Setting.find({},(err,settings)=>{
    if(err){
      throw err;
    }

    else{
      var maxWeekNum = moment().isoWeek() + settings[0].weeksAhead;
      console.log("max week num: " + maxWeekNum);
      res.send(maxWeekNum.toString());
    }
  });
});

app.get('/getSpaces',(req,res)=>{
  Setting.find({},(err,settings)=>{
    if(err){
      throw err;
    }

    else{
      var spaces = settings[0].spaces;
      res.send(spaces)
    }
  });
});

app.get('/logout',(req,res)=>{
  req.logout();     //logout is a function Passport adds to Express somehow
  res.redirect('/');
});

//Checks if user has logged in before giving access to profile
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }

  else{
    //flashes a message that says 'please login to view a profile' if you
    //try to access /profile without logging in.
    req.flash('danger','Please login to view a profile');
    res.redirect('/');
  }
}

app.listen(3000);
