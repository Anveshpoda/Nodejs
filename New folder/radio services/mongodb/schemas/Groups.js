var mongoose = require('../Connections').db
var Schema = mongoose.Schema;
//const autopopulate = require('mongoose-autopopulate');
var usersSchema = Schema({
    userId:{ type: Schema.Types.ObjectId, ref: 'UserProfile' },
    type:String,
    status:Number,
}, { _id: false })
/*var joinSchema = Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'UserProfile' },
    userName:[{type: Schema.Types.ObjectId, ref: 'UserProfile'}],

   
},{ _id:false})*/
var feedSchema = Schema({ 
   // fullName : String,
   // location: String,
   // profileImage: String,

   userId: { type: Schema.Types.ObjectId,ref: 'UserProfile' },
   groupImageUrl:String,
   description : String,
   type:String,
   // likes:{type:Number,default:0},
   createdDateTime:{type: Date, default: Date.now},
   modifiedDateTime: Date,
  // users: [UsersSchema],
});
var wallSchema = Schema({ 
   // fullName : String,
   // location: String,
   // profileImage: String,

   userId: { type: Schema.Types.ObjectId,ref: 'UserProfile' },
   groupImageUrl:String,
   description : String,
   createdDateTime:{type: Date, default: Date.now},
   modifiedDateTime: Date,
  // users: [UsersSchema],
});
var likeSchema = Schema({ 
  userId: { type: Schema.Types.ObjectId,ref: 'UserProfile' },
  feedId:String,
  wallId:String,
   })
var commentSchema=Schema({
  userId: { type: Schema.Types.ObjectId,ref: 'UserProfile' },
  feedId:String,
  createdDateTime:{type: Date, default: Date.now},
  wallId:String,
  comment:String,
})

var groupSchema = Schema({
     userId: { type: Schema.Types.ObjectId, ref: 'UserProfile' },
    // profileImage: { type: Schema.Types.String, ref: 'UserProfile' },
    groupName: String,
    groupImageUrl: String,
    category:String,
    description: String,
    // likes:{type:Number,default:0},
   
    hashTag: String,
    
    location: String, 
    
    createdDate: Date,
    updatedDate: Date,
    
    users: [usersSchema],
    gfeeds:[feedSchema],
    wall:[wallSchema],
     likes:[likeSchema],
    comments:[commentSchema],
    //groupusers:[joinSchema],
}, { versionKey: false, collection: 'Groups' })



var groupModel = mongoose.model('Groups', groupSchema);
exports = module.exports = groupModel;

//groupSchema.plugin(autopopulate)
//,autopopulate : true
