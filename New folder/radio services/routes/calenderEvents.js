var express = require('express')
var mongoose = require('../mongodb/Connections')
var mongoose1 = require('mongoose')
var router = express.Router()
var utils = require('../routes/Utils')
var ObjectId = require('mongodb').ObjectID;  
var userProfile = require('../mongodb/schemas/UserProfile')
var eventsModel = require('../mongodb/schemas/Events')

router.get('/events', function (req, res) {
    eventsModel.find({addCalender:true} ,function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    }).sort({eventStartDateTime: -1 });
});


module.exports = router