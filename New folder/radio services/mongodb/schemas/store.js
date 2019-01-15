var mongoose = require('../Connections').db
var Schema = mongoose.Schema;


var wallSchema = Schema({ 
   // fullName : String,
   // location: String,
   // profileImage: String,

   userId: { type: Schema.Types.ObjectId,ref: 'UserProfile' },
   imageUrl:String,
   description : String,
   createdDateTime:{type: Date, default: Date.now},
   modifiedDateTime: Date,
  // users: [UsersSchema],
});
var likeSchema = Schema({ 
  userId: { type: Schema.Types.ObjectId,ref: 'UserProfile' },
  wallId:String,
   })

var commentSchema=Schema({
  userId: { type: Schema.Types.ObjectId,ref: 'UserProfile' },
  wallId:String,
  comment:String,
})
	let store = Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'UserProfile'},
   	storeName : String,
    storeLocation : String,
    mobileNumber : Number,
    imageUrl:String,
    description : String,
   	geo: {
    type: [Number],
    index: '2d'
    },
	  email : String,
   	website : String,
    wall:[wallSchema],
    likes:[likeSchema],
    comments:[commentSchema],
    

}, { versionKey: false, collection: "Store" });

let Store = mongoose.model('Stores', store);
module.exports = Store;