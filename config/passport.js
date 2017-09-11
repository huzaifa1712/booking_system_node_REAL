var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require('../models/user');
//var Booking = require('../models/booking');
var configAuth = require('./auth');

module.exports = function(passport){
  passport.serializeUser((user,done)=>{
    done(null,user.id); //only user id is serialized to the session
  });

  passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
      done(err,user);
    });
  });

      passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL
      },

      function(accessToken, refreshToken, profile, done){
        User.findOne({
          'google_id':profile.id
        }, (err,user)=>{
          //
          if(err){
            return done(err);
          }

          if(user){
            return done(null,user);
          }

          else{
            var newUser = new User();
            newUser.google_id = profile.id;
            newUser.token = accessToken;
            newUser.name = profile.displayName;
            newUser.email = profile.emails[0].value;
            newUser.isADmin = false;

            newUser.save((err)=>{
              if(err){
                throw err;
              }

              else{
                return done(null,newUser);
              }
            });
            /*CODE FOR ADDING A BOOKING WITH A USER OBJECT
            var newBooking = new Booking();
            newBooking.user = newUser;
            newBooking.hoursBefore = 2;
            newBooking.save((err)=>{
              if(err){
                throw err;
              }

              else{
                console.log("booking added");
              }
            });*/

          }
        });
      }
    )
  );
}
