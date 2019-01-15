var mongoose = require('../Connections').db
var Schema = mongoose.Schema;

var storySchema = Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'UserProfile',autopopulate : true },
    title:String,
    story: String,
    imageUrl:String,   
}, { versionKey: false, collection: "stories" });

var stories = mongoose.model('stories', storySchema);
exports = module.exports = stories;
// eventStatusId: Number,