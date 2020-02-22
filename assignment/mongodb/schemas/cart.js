var mongoose = require('../Connections').db
var Schema = mongoose.Schema;

var UserSchema = Schema({  
   name : { type: String, required:true},
   cost : { type: Number, required:true}
},{ versionKey: false , collection: "shopItems" });

mongoose.model('shopItems', UserSchema);
module.exports = mongoose.model('shopItems');