var mongoose = require('../Connections').db
var Schema = mongoose.Schema;

var UserSchema = Schema({  
   name : { type: String, required:true},
},{ versionKey: false , collection: "category" });

mongoose.model('category', UserSchema);
module.exports = mongoose.model('category');