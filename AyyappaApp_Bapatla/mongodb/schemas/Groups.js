'use strict'
let mongoose = require('../Connections').db
let Schema = mongoose.Schema;
//const autopopulate = require('mongoose-autopopulate');
let usersSchema = Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'UserProfile'
    },
    mobileNumber: String,
}, { _id: false })

let groupSchema = Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'UserProfile' },
    groupName: String,
    groupImageUrl: String,
    groupIcon: String,
    description: String,
   
    hashTag: String,
    keywords: String,
    latitude: String,
    longitude: String,
    locationName: String,
    createdDate: Date,
    updatedDate: Date,
    inviteMember: Number,
    users: [usersSchema],
}, { versionKey: false, collection: 'Groups' })



let groupModel = mongoose.model('Groups', groupSchema);
exports = module.exports = groupModel;

//groupSchema.plugin(autopopulate)
//,autopopulate : true
