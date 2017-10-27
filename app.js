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
var fs = require('fs');
var reminder = require('./reminder');
let account = require('./config/email_user');
var Mail = require('./mail');

const mail = new Mail(account.user,account.pass);

//check bookings and send reminder emails when required every one second.
setInterval(function(){
  reminder.checkBookingsAndSendEmails();

},1000);
//Models
var Booking = require('./models/bookingSimple');
var Setting = require('./models/settingsModel');
var Space = require('./models/space');
//Moment
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

//sets where to look for the template files(the 'views folder')
app.set('views', path.join(__dirname,'views'));
//sets the view engine to use, in this case Pug
app.set('view engine','pug');

//MIDDLEWARES
  app.use(express.static(path.join(__dirname,'public'))); //static assets
  app.use(session({ //session middleware
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  }))

  app.use(flash()); //messages and flash middleware
  //this middleware needed for flashing messages
  app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
  });

  app.use(expressValidator()); //validator middleware

  app.use(passport.initialize()); //passport middleware
  app.use(passport.session());
  var urlencodedParser = bodyParser.urlencoded({extended:false}); //bodyParser for POST

//ROUTES

  //Google routes(login)

  //Route to authenticate users. This is where the login button on the landing page
  //points to.
  app.get('/auth/google', passport.authenticate('google', {
    //telling it what to look for in the account(scope), so profile(for name,id) and email
    scope: ['profile','email']
  }));

  //This is a callback that executes after login is done.
  app.get('/auth/google/callback',passport.authenticate('google',{
    //redirect to 'account_page' if succeeded in logging in, if not go to index
    successRedirect: '/account_page',
    failureRedirect: '/',
    failureFlash:true
  }));

//Normal routes

//get the Settings required to render the bookings_table. This is used in
//populate_bookings.js
app.get('/getSettings/:spaceName',(req,res)=>{
  console.log("Visited getSettings");
  console.log(req.params.spaceName);

  //Find all spaces with that name. Should be only one, so we are using findOne
  Space.findOne({name:req.params.spaceName},function(err,spaces){
    if(err){
      throw err;
    }

    else{
      console.log('spaces');
      console.log(spaces);
      //Get the days array for that space(e.g ["Monday","Tuesday","Wednesday","Thursday"])
      var days = spaces.days;
      console.log("days:")
      console.log(days);
      console.log("times:")
      //Get the times array for that space(e.g ["12:45 - 1:15","1:15 - 1:45","1:45 - 2:15"])
      var times = spaces.returnTimes;
      console.log(times);

      //return an object with days and times as response.
      var settingsObj = {
        days:days,
        times:times
      }

      res.json(settingsObj);
    }
  });
});



//API ROUTES. ALL USED IN JQUERY

//route that returns bookings for the user, using user's id.. Used in your_bookings page
//to populate the table
//Files: your_bookings.js
app.get('/user_bookings',(req,res)=>{
  //request bookings with this user's id.
  var query = {
    user_id:req.user._id
  }

  Booking.find(query,function(err,bookings){
    if(err){
      throw err;
    }

    else{
      console.log("user bookings:");
      console.log(bookings);
      //send the bookings
      res.json(bookings);
    }
  });
});

//route to delete a booking by ID. Different from cancel because it doesn't send
//an email.
//Files: your_bookings.js
app.get('/delete_booking/:id',(req,res)=>{
  var id = req.params.id;
  console.log("Delete id: " + id);
  Booking.findById(id,function(err,doc){
    console.log("Deleted: " + doc);
    doc.remove();
    res.json({deleted:true});
  });
});

//route used for admin page, cancelling a booking. Sends e-mail then deletes
//the booking.
//Files: admin_cancel_bookings.js
app.get('/cancel_booking/:id',(req,res)=>{
  var id = req.params.id;
  console.log("Delete id: " + id);
  Booking.findById(id,function(err,booking){
    var email = Mail.constructDeleteEmailHTML(booking);
    var address = booking.email;
    var subject = "Booking cancelled"

    mail.sendMail(address,subject,email);
    console.log("Deleted: " + booking);
    booking.remove();
    res.json({deleted:true});
  });
});

//App to return a booking by ID. Used in populating the modal when admin cancels
//booking.
//Files: admin_cancel_bookings.js
app.get('/bookingById/:id',(req,res)=>{
  Booking.findById(req.params.id, function(err,booking){
    res.json(booking);
  });
});

//populate bookings uses this route to get the bookings and populate the table
//Files: populate_bookings.js
app.get('/bookings/:isoWeekNum/:spaceName',(req,res)=>{
//returns bookings only with that isoWeekNum
  Booking.find(function(err,bookings){
    if(err){
      throw err;
    }

    else{
      //Filter out and return an array of bookings where the weeknumber of the booking
      //is equal to the weeknumber requested, and where the booking's space name is equal to
      //the space name being requested.
      var bookingsArr = bookings.filter(function(booking){
        console.log(req.params.spaceName);
        return moment(booking.date.startTime).isoWeek() == req.params.isoWeekNum && booking.space == req.params.spaceName.replace(/\s+/g, '');
      });
      console.log("Bookings returned: ");
      console.log(bookingsArr);
      res.json(JSON.stringify(bookingsArr));
    }
  });
});

//this route takes the Booking information when user makes a booking and saves it
//Files: make_bookings.js
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
    newBooking.user_id = req.body.id;
    newBooking.name = req.body.name;
    newBooking.email = req.body.email;
    newBooking.time = req.body.timeString;
    newBooking.date.startTime = req.body.startTime;
    newBooking.date.endTime = req.body.endTime;
    newBooking.reminder = req.body.reminder;
    newBooking.space = req.body.space;
    newBooking.spaceNameWithSpaces = req.body.spaceNameWithSpaces;
    //newBooking.emailSent = false;
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
//Files: make_bookings.js
app.get('/get_user', isLoggedIn,(req,res)=>{
  console.log("User body: ");
  console.log(req.user);

  res.json(req.user);
});

//returns the maximum week number. Used for pagination of the bookings table.
//Files: populate_bookings.js
app.get('/maxWeekNum', (req,res)=>{
  Setting.find({},(err,settings)=>{
    if(err){
      throw err;
    }

    else{
      //max week num = current week num + max number of weeks ahead from Settings
      var maxWeekNum = moment().isoWeek() + settings[0].weeksAhead;
      console.log("max week num: " + maxWeekNum);
      res.send(maxWeekNum.toString());
    }
  });
});

//Route for getting space details and populating the table in admin_settings.
//File: admin_settings.js
app.get('/get_spaces',(req,res)=>{
  Space.find({},function(err,spaces){
    if(err){
      throw err;
    }

    else{
      res.json(spaces);
    }
  });
});

//Route for getting details for one space and populating the modal in admin_settings.
//File: admin_settings.js
app.get('/get_space/:id',(req,res)=>{
  Space.findById(req.params.id,function(err,space){
    if(err){
      throw err;
    }

    else{
      res.json(space);
    }
  });
});

//Route for updating a space from admin_settings page modal.
//Files: admin_settings.js
app.post('/update_space',urlencodedParser,(req,res)=>{
  var space = req.body;
  //var days = space['days[]'];
  //var times = space['times[]'];
  console.log("SPACE");
  console.log(req);
  console.log(space.data);

  var shit = space.data;
  console.log(JSON.parse(shit));
  var moreShit = JSON.parse(shit);
  console.log(moreShit.times);

  Space.findOneAndUpdate({_id:moreShit.id},{$set:{days:moreShit.days, times:moreShit.times}},{new:true},function(err,space){
    if(err){
      throw err;
    }

    else{
      console.log(space);
    }
  });

  res.json();
});



//ROUTES FOR PAGES.

//Index page(landing page)
app.get('/',(req,res)=>{
  //USES SETTINGS
  console.log("Visited Index");
  //Find and pass in array of spaces with the name. Used to populate dropdown.
  Space.getSpaceNames(function(err,spaces){
    if(err){
      throw err;
    }
    else{
      res.render('index',{
        spaces:spaces
      });
    }
  });
});

app.get('/account_page',isLoggedIn, (req,res)=>{
  //USES SETTINGS
  //if user is not administrator, proceed to account page.
  if(!req.user.isAdmin){
    Space.getSpaceNames(function(err,spaces){
      res.render('account_page',{
        user:req.user,
        spaces:spaces
      });

    });
  }

  //if user is admin, redirect to admin_page
  else{
    res.redirect('/admin_page');
  }
});



  //get route for your_bookings page.
  app.get('/your_bookings',isLoggedIn,(req,res)=>{
        res.render('your_bookings',{
          user:req.user
        });
  });

  //get route for admin page.
  app.get('/admin_page',isAdmin,(req,res)=>{
    Space.getSpaceNames(function(err,spaces){
      res.render('admin_page',{
        user:req.user,
        spaces:spaces
      });
    });
  });

  app.get('/admin_settings',isAdmin,(req,res)=>{
    res.render('admin_settings',{
      user:req.user
    })
  });


//this route handles logging out.
app.get('/logout',(req,res)=>{
  req.logout();     //logout is a function Passport adds to Express somehow
  res.redirect('/');
});


//CUSTOM MIDDLEWARE

//Checks if user has logged in before giving access to profile
function isLoggedIn(req,res,next){
  //checks if user is authenticated(logged in)
  if(req.isAuthenticated()){
    return next();
  }

  else{
    //flashes a message that says 'please login to view a profile' if you
    //try to access /profile without logging in.
    req.flash('danger','Please login to access that page');
    res.redirect('/');
  }
}

//This middleware checks if the user is an admin account. If logged in but not
//admin, it redirects to account page. If not logged in, redirects to index.
function isAdmin(req,res,next){
  //logged in and admin
  if(req.isAuthenticated() && req.user.isAdmin == true){
    return next();
  }

  //logged in but not admin
  else if(req.isAuthenticated()){
    req.flash('danger','You must be logged in as an administator to access that page');
    res.redirect('/account_page');
  }

  //not logged in
  else{
    req.flash('danger','You must be logged in as an administator to access that page');
    res.redirect('/')
  }
}

app.listen(3000);
