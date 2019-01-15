//let mongoConfig = require('./mongodb/Connections')
'use strict'
let mongoose = require('../Connections').db
let bcrypt   = require('bcrypt-nodejs');

let userSchema = mongoose.Schema({
  local: {
    mobilenumber:String
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String,
    username: String,
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String,
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String,
  },
  name:String,
    imageurl:String,
    //password: String,
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};
module.exports = mongoose.model('UserDetails', userSchema);
