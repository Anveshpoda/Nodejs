var mongoose = require('../Connections').db
var Schema = mongoose.Schema;

var imagesSchema = Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'UserProfile',autopopulate : true },
    backgroundImageUrl: String,   
}, { versionKey: false, collection: "BackgroundImages" });

var backgroundImagesModel = mongoose.model('BackgroundImages', imagesSchema);
exports = module.exports = backgroundImagesModel;
// eventStatusId: Number,