'use strict'
let mongoose = require('../Connections').db
let Schema = mongoose.Schema;

let UserSchema = Schema({  
  mobileNumber : { type: String,required:true},
  username : String,
   email : String,
   profileImage: String,
   createdDateTime: Date,
   modifiedDateTime: Date,
},{ versionKey: false , collection: "UserProfile" });

mongoose.model('UserProfile', UserSchema);
module.exports = mongoose.model('UserProfile');