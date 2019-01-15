var mongoose = require('../Connections').db
var Schema = mongoose.Schema;


var feedSchema = Schema({ 
   userId: { type: Schema.Types.ObjectId,ref: 'UserProfile' },
   feedsDescription : String,
   type:String,
   feedsImageUrl : String,
   createdDateTime:{type: Date, default: Date.now},
   modifiedDateTime: Date,
 
},
{ versionKey: false , collection: "Universalfeed" });

mongoose.model('Universalfeed', feedSchema);
module.exports = mongoose.model('Universalfeed');