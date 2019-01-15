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
var rsvpSchema = Schema({
     userId: { type: Schema.Types.ObjectId, ref: 'UserProfile' },
    // profileImage: { type: Schema.Types.String, ref: 'UserProfile' },
       
    users: [usersSchema],
    maybe: [usersSchema],
    no: [usersSchema]
    
    //groupusers:[joinSchema],
}, { versionKey: false, collection: 'Rsvp' })



var rsvpModel = mongoose.model('Rsvp', rsvpSchema);
exports = module.exports = rsvpModel;

//groupSchema.plugin(autopopulate)
//,autopopulate : true
