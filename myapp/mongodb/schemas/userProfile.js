var mongoose = require('../Connections').db
var Schema = mongoose.Schema;

var UserSchema = Schema({  
   mobileNumber :  String,
   firstName : { type: String,required:true},
   lastName : String,
   email : String,
   password : String,
   userid : String,
   location: String,
   profileImage: String,
   createdDateTime: Date,
   modifiedDateTime: Date,
},{ versionKey: false , collection: "UserProfile" });

mongoose.model('UserProfile', UserSchema);
module.exports = mongoose.model('UserProfile');