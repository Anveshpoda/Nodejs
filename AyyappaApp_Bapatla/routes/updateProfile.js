'use strict'
let express = require('express')
let mongoose = require('../mongodb/Connections')
let mongoose1 = require('mongoose')
let router = express.Router()
let logger = require('../logger')
let utils = require('../routes/Utils')
let userProfile = require('../mongodb/schemas/UserProfile')
let ObjectId = require('mongodb').ObjectID;

// http://localhost:8080/updateProfile
router.post('/', function (req, res, next) {
  let input = req.body
  //console.log(' ::: updateProfile ::: ' + 'userId : ' + input.userId + ' fullName : ' + input.fullName)
  console.log(req.body)
  let response = { statusCode: 1, statusMessage: "Success success" }
  userProfile.findOne({ _id: input.userId }, function (err, user) {
    if (err) res.json({ statusCode: 0, statusMessage: "Error" })
    else if (!user) {
      console.log('No User found'); res.json({ statusCode: 0, statusMessage: "No User found" })
    } else if (user) {
      user.userId = input.userId,
        user.fullName = input.fullName,
        user.aboutYou = input.aboutYou,
        user.location = input.location,
        user.profileImage = input.profileImage,
        user.modifiedDateTime = utils.dateInUTC()
      saveUser(user, res)
    }
  })
})

let saveUser = function (user, res) {
  user.save(function (err, doc) {
    if (err) {
      res.json({ statusCode: 0, statusMessage: "something went wrong" })
    }
    let tempUserProfile = user.toObject()
    tempUserProfile.userId = doc._id
    delete tempUserProfile._id

    res.json({ statusCode: 1, statusMessage: 'Updated user', data: tempUserProfile })
  })
}

module.exports = router;


