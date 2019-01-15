// var express = require('express')
// var router = express.Router()
// var ObjectId = require('mongodb').ObjectID
// var utils = require('../routes/Utils')
// var logger = require('../logger')
// var userProfileModel = require('../mongodb/schemas/UserProfile')
// var groupsModel = require('../mongodb/schemas/Groups')
// var notifications = require('../mongodb/schemas/Notifications')
// // let eventsModel = require('../mongodb/schemas/Events')
// let mongoose = require('../mongodb/Connections')

let express = require('express')
let mongoose = require('../mongodb/Connections')
let mongoose1 = require('mongoose')
let router = express.Router()
let utils = require('../routes/Utils')
let logger = require('../logger')
let ObjectId = require('mongodb').ObjectID;
let userProfile = require('../mongodb/schemas/UserProfile')
let groupsModel = require('../mongodb/schemas/Groups')

router.get('/', function (req, res) {
    var input = req.query
    logger.debug('::: likeorUnlikeForEvent ::: ' + 'userId : ' + input.userId + ', groupId : ' + input.groupId + ', Status : ' + input.joinStatus);
    var response = { statusCode: 2 }
    validateRequest(input, response)
    userProfile.findById({ _id: input.userId }, function (err, data) {
        if (err) {
            logger.debug('userProfile Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "Bad Request", data: null })
        } else if (!data) {
            logger.debug("InValid UserId"); res.json({ statusCode: 3, statusMessage: "Bad Request", data: null })
        } else {
            if (response.statusCode != 0) {
                groupsModel.findById(input.groupId, function (err, groupData) {
                    if (err) {
                        logger.debug('eventData Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "Error", data: null })
                    } else if (!groupData) {
                        logger.debug("No Event found"); res.json({ statusCode: 3, statusMessage: "Bad Request", data: null })
                    } else {
                        var isJoinedUser = false
                        if (req.query.joinStatus == '2') {
                            var alreadyLiked = false
                            for (var i = 0; i < groupData.users.length; i++) {
                                if (req.query.userId === String(groupData.users[i].userId)) {
                                    alreadyLiked = true
                                    break
                                }
                            }
                            if (!alreadyLiked) {
                                var likedUserData = {}
                                likedUserData.userId = req.query.userId
                                likedUserData.status = req.query.joinStatus
                                likedUserData.createdDateTime = utils.dateInUTC()
                                groupData.users[groupData.users.length] = likedUserData
                            }
                        }
                        else if (req.query.joinStatus == '1') {
                            var alreadyLiked = false
                            for (var i = 0; i < groupData.users.length; i++) {
                                if (req.query.userId === String(groupData.users[i].userId)) {
                                    alreadyLiked = true
                                    break
                                }
                            }
                            if (!alreadyLiked) {
                                var likedUserData = {}
                                likedUserData.userId = req.query.userId
                                likedUserData.status = req.query.joinStatus
                                likedUserData.createdDateTime = utils.dateInUTC()
                                groupData.users[groupData.users.length] = likedUserData
                            }
                        } 
                         else {
                            for (var i = 0; i < groupData.users.length; i++) {
                                if (req.query.userId === String(groupData.users[i].userId)) {
                                    groupData.users.splice(i, 1)
                                    break
                                }
                            }
                        }

                        groupData.membersCount = groupData.users.length

                        groupData.save(function (err) {
                            if (err) {
                                logger.debug('groupData save Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "ERROR" })
                            } else {
                                var responceObj = {}
                               // responceObj.eventId = eventData._id
                                responceObj.userName=data.userName
                                responceObj.profileImage=data.profileImage
                                responceObj.userId = req.query.userId
                                responceObj.membersCount = groupData.users.length
                                responceObj.joinStatus = req.query.joinStatus
                                res.json({ statusCode: 1, statusMessage: "Success", data: responceObj })
                            }
                        })
                    } 
                })
            }
             else {
                res.json(response)
            }
        }
    })
})


function validateRequest(input, response, req) {
    if (!utils.isValidObjectID(input.userId)) {
        response.statusCode = 0; response.statusMessage = "invalid userId"
    } else if (!utils.isValidObjectID(input.groupId)) {
        response.statusCode = 0; response.statusMessage = "invalid groupId"
    }
    if (!(input.joinStatus == '2' || input.joinStatus == '0' || input.joinStatus=='1')) {
        response.statusCode = 0; response.statusMessage = "invalid joinStatus"
    }
}

module.exports = router