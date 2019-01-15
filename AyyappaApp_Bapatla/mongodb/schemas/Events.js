'use strict'
let mongoose = require('../Connections').db
let Schema = mongoose.Schema;

let eventSchema = Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'UserProfile',autopopulate : true },
    eventTitle: String,
    eventDescription: String,
    eventDate : String,
    eventStartDateTime: Date,
    eventEndDateTime: Date,
    eventImageUrl: String,
    eventLocation: String,
    addCalender : { type: Boolean, default: false },
    latitude: Number,
    longitude: Number,
    createdDateTime: Date,
    modifiedDateTime: Date,
}, { versionKey: false, collection: "Events" });

let eventsModel = mongoose.model('Events', eventSchema);
exports = module.exports = eventsModel;
// eventStatusId: Number,