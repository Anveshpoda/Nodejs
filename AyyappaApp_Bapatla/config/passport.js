let LocalStrategy = require('passport-local').Strategy;
let FacebookStrategy = require('passport-facebook').Strategy;
let TwitterStrategy = require('passport-twitter').Strategy;
let GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
let express = require('express');
let passport = require('passport');
let bodyParser = require('body-parser');
passport.use(bodyParser.json());
passport.use(bodyParser.urlencoded({ extended: false }));
let router = express.Router();
let User= require('../mongodb/schemas/UserDetails');
//let User = require('../models/user');

let configAuth = require('./auth');
module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

passport.use('local-signup', new LocalStrategy({
    mobilenumberField: 'mobilenumber',
    imageurlField: 'imageurl',
    nameField : 'name',
    userIdField:'userid',
    passReqToCallback: true,
  },
  function(req, mobilenumber , done) {
    process.nextTick(function() {
      let input=req.body
        User.findOne({ 'local.mobilenumber':  mobilenumber }, function(err, user) { console.log("mobile block");
        if (err)
            return done(err);
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That mobilenumber is already taken.'));
        } else {
          let newUser = new User();
          newUser.local.mobilenumber = mobilenumber;
          newUser.name=""
          newUser.imageurl=""
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      })
      }); 
      
  }));
     passport.use('local-update', new LocalStrategy({
    mobilenumberField: 'mobilenumber',
    imageurlField: 'imageurl',
    nameField : 'name',
    userIdField:'userid',
    //passReqToCallback: true,
  },
  function(req, mobilenumber , done) {
    process.nextTick(function(request,response) {
       //if(!req.user){
        //User.findOne({ 'local.mobilenumber':  mobilenumber }, function(err, user) { console.log("mobile block");
        User.findOne({ 'user.mobilenumber' :  mobilenumber }, function(err, user) {
                    if (err){ return done(err);}
                    if (user)
                          user.updateUser(request, response)

                         });
    }); 
  }));
 passport.use('local-login', new LocalStrategy({
    usernameField: 'mobilenumber',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, mobilenumber, password, done) {
    User.findOne({ 'local.mobilenumber': mobilenumber }, function(err, user) {
      if (err)
          return done(err);
      if (!user)
          return done(null, false, req.flash('loginMessage', 'No user found.'));
      if (!user.validPassword(password))
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
      return done(null, user);
    });
  }));

  passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    profileFields: ['id', 'email', 'first_name', 'last_name'],
  },
  function(token, refreshToken, profile, done) {
    process.nextTick(function() {
      //let input=req.body
      User.findOne({ 'facebook.id': profile.id }, function(err, user) {
        if (err)
          return done(err);
        if (user) {
          return done(null, user);
        } else {
          let newUser = new User();
          newUser.facebook.id = profile.id;

          newUser.facebook.token = token;
          newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
          newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();
          newUser.name=""
          newUser.imageurl=""
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));

  passport.use(new TwitterStrategy({
    consumerKey: configAuth.twitterAuth.consumerKey,
    consumerSecret: configAuth.twitterAuth.consumerSecret,
    callbackURL: configAuth.twitterAuth.callbackURL,
  },
  function(token, tokenSecret, profile, done) {
    process.nextTick(function() {
      User.findOne({ 'twitter.id': profile.id }, function(err, user) {
        if (err)
          return done(err);
        if (user) {
          return done(null, user);
        } else {
          let newUser = new User();
          newUser.twitter.id          = profile.id;
          newUser.twitter.token       = token;
          newUser.twitter.username    = profile.username;
          newUser.twitter.displayName = profile.displayName;
          newUser.save(function(err) {
            if (err)
             throw err;
            return done(null, newUser);   
          });
        }
      });
    });
  }));

  passport.use(new GoogleStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL,
  },
    function(token, refreshToken, profile, done) {
      process.nextTick(function() {
        User.findOne({ 'google.id': profile.id }, function(err, user) {
          if (err)
            return done(err);
          if (user) {
            return done(null, user);
          } else {
            let newUser = new User();
            newUser.google.id = profile.id;
            newUser.google.token = token;
            newUser.google.name = profile.displayName;
            newUser.google.email = profile.emails[0].value;
            newUser.name=""
            newUser.imageurl=""
            newUser.save(function(err) {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }
        });
      });
    }));

};
