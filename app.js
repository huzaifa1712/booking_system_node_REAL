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
var settings = require('./setting.js');

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
  res.render('index',{
    days:settings.days,
    times:settings.returnTimes(settings.times)

  });
});

app.get('/account_page',isLoggedIn, (req,res)=>{
  res.render('account_page',{
    user:req.user,
    days:settings.days,
    times:settings.returnTimes(settings.times)
  });

});

app.get('/bookings_table',(req,res)=>{

});

//test for populate bookings
app.get('/bookings',(req,res)=>{
  var bookings = [
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
  res.json(JSON.stringify(bookings));
});

app.post('/make_booking', urlencodedParser, (req,res)=>{
  //console.log('lol');
  console.log(req.body);
  //req.flash('success','Booking made!');
  //res.redirect('/account_page');
});

//a route that sends back a user JSON object which can be used when making bookings
app.get('/get_user', isLoggedIn,(req,res)=>{
  res.json(JSON.stringify(req.user));
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
