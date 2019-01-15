var mongoose = require('../Connections').db
var Schema = mongoose.Schema;
var userSchema = Schema({
    userId:{ type: Schema.Types.ObjectId, ref: 'UserProfile' },
    type:String,
    status:Number,
}, { _id: false })
var eventSchema = Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'UserProfile',autopopulate : true },
    eventTitle: String,
    eventDescription: String,
    eventDate : String,
    eventStartDateTime: Date,
    eventEndDateTime: Date,
    eventImageUrl: String,
    eventLocation: String,
    addCalender : { type: Boolean, default: false },
    // latitude: Number,
    // longitude: Number,
    geo: {
    type: [Number],
    index: '2d'
  },
    createdDateTime: Date,
    modifiedDateTime: Date,
    users:[userSchema],
}, { versionKey: false, collection: "Events" });

var eventsModel = mongoose.model('Events', eventSchema);
exports = module.exports = eventsModel;
// eventStatusId: Number,