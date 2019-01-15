var mongoose = require('../Connections').db
var Schema = mongoose.Schema;

var UserSchema = Schema({  
  mobileNumber : { type: String,required:true},
  userName : String,
   email : String,
   location: String,
   profileImage: String,
   createdDateTime: Date,
   modifiedDateTime: Date,
},{ versionKey: false , collection: "UserProfile" });

mongoose.model('UserProfile', UserSchema);
module.exports = mongoose.model('UserProfile');