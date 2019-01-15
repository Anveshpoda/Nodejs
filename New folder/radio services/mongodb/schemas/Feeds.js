var mongoose = require('../Connections').db
var Schema = mongoose.Schema;

var UsersSchema = Schema({
    userId: { type: Schema.Types.ObjectId,ref: 'UserProfile' },
     fullName : String,
     profileImage: String,
    }, { _id: false })


// var feedSchema = Schema({ 
//    // fullName : String,
//    // location: String,
//    // profileImage: String,

//    groupId: { type: Schema.Types.ObjectId,ref: 'Groups' },
//    groupName:String,
//    eventDescription : String,
//    createdDateTime:{type: Date, default: Date.now},
//    modifiedDateTime: Date,
//   // users: [UsersSchema],
// },
// { versionKey: false , collection: "Gfeed" });

var feedSchema = Schema({ 
   // fullName : String,
   // location: String,
   // profileImage: String,

   userId: { type: Schema.Types.ObjectId,ref: 'UserProfile' },
   groupName:String,
   description : String,
   imageUrl:String,
   createdDateTime:{type: Date, default: Date.now},
   modifiedDateTime: Date,
  // users: [UsersSchema],
},
{ versionKey: false , collection: "Gfeed" });

mongoose.model('Gfeed', feedSchema);
module.exports = mongoose.model('Gfeed');