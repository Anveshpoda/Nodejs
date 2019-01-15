'use strict'
let express = require('express')
let mongoose = require('../mongodb/Connections')
let mongoose1 = require('mongoose')
let router = express.Router()
let utils = require('../routes/Utils')
let ObjectId = require('mongodb').ObjectID;  
let userProfile = require('../mongodb/schemas/UserProfile')
let eventsModel = require('../mongodb/schemas/Events')

router.get('/', function (req, res) {
    eventsModel.find({} ,function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    }).sort({eventStartDateTime: 'desc' });
});

module.exports = router