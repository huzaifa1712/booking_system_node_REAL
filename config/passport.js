/*
1. npm install passport, passport-google-oauth
2. Set up auth.js with client id, client secret, etc from Google
3. Set up the userSchema with id,token,email,name all Strings
4. In app.js, require passport, and make sure to do app.use(initialize()), and
app.use(session()). Make sure this is AFTER app.use(express.session()) from express-session
package
5. require('./config/passport.js')(passport) after require('passport')
6. Create passport.js in config, then do the below:

*/

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require('../models/users');
var configAuth = require('./auth');

module.exports = function(passport){

/* In a typical web application, the credentials used to authenticate a user
 will only be transmitted during the login request. If authentication succeeds,
  a session will be established and maintained via a cookie set in the user's browser.

Each subsequent request will not contain credentials, but rather the unique cookie
 that identifies the session. In order to support login sessions,
  Passport will serialize and deserialize user instances to and from the session.*/
  passport.serializeUser((user,done)=>{
    done(null,user.id); //only user id is serialized to the session
  });

  passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
      done(err,user);
    });
  })

  passport.use(new GoogleStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL
  },
function(accessToken,refreshToken,profile,done){
  User.findOne({'google_id': profile.id}, (err,user)=>{
    console.log(profile.id);
    //if there was an error from finding someone
    if(err){
      return done(err);
    }
    //if the user exists
    if(user){
      return done(null,user);
    }
    //if there is no user, so we need to create one
    else{
      //create the new User and add it to our db
      var newUser = new User();
      newUser.google_id = profile.id;
      newUser.token = accessToken;
      newUser.name = profile.displayName;
      newUser.email = profile.emails[0].value;

      newUser.save((err)=>{
        //if error throw error
        if(err){
          throw err;
        }
        //else return newUser into the original callback
        else{
          return done(null,newUser);
        }
      });
    }
  });
}
));
}
