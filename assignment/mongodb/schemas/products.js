var mongoose = require('../Connections').db
var Schema = mongoose.Schema;

var UserSchema = Schema({  
   name : { type: String, required:true},
   categoryId : { type: String, required:true},
},{ versionKey: false , collection: "products" });

mongoose.model('products', UserSchema);
module.exports = mongoose.model('products');