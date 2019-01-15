'use strict'
let mongoose = require('../Connections').db
let Schema = mongoose.Schema;

let imagesSchema = Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'UserProfile',autopopulate : true },
    backgroundImageUrl: String,   
}, { versionKey: false, collection: "backgroundImages" });

let backgroundImagesModel = mongoose.model('backgroundImages', imagesSchema);
exports = module.exports = backgroundImagesModel;
// eventStatusId: Number,