

let express = require('express')
let mongoose = require('../mongodb/Connections')
let mongoose1 = require('mongoose') 
let router = express.Router()
let utils = require('../routes/Utils')
let logger = require('../logger')
let ObjectId = require('mongodb').ObjectID;
let userProfile = require('../mongodb/schemas/UserProfile')
let eventsModel = require('../mongodb/schemas/Events')

router.get('/', function (req, res) {
    var input = req.query
    logger.debug('::: likeorUnlikeForEvent ::: ' + 'userId : ' + input.userId + ', eventId : ' + input.eventId + ', Admin : ' + input.adminId);
    var response = { statusCode: 2 }
    validateRequest(input, response)
    userProfile.findById({ _id: input.userId }, function (err, data) {
        if (err) {
            logger.debug('userProfile Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "Bad Request", data: null })
        } else if (!data) {
            logger.debug("InValid UserId"); res.json({ statusCode: 3, statusMessage: "InValid UserId", data: null })
        } else {
            if (response.statusCode != 0) {
                eventsModel.findById(input.eventId,function (err, eventData) {
                    if (err) {
                        logger.debug('eventData Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "Error", data: null })
                    } else if (!eventData) {
                        logger.debug("No Event found"); res.json({ statusCode: 3, statusMessage: "Bad Request", data: null })
                    } else if(eventData.userId==input.adminId){
                        var isJoinedUser = false
                        if (eventData) {
                            var alreadyLiked = false
                            for (var i = 0; i < eventData.users.length; i++) {
                                if (req.query.userId === String(eventData.users[i].userId)) {
                                    alreadyLiked = true
                                    var likedUserData = {}
                                    likedUserData.userId = req.query.userId
                                    likedUserData.type = "admin"
                                    likedUserData.status = 3
                                    eventData.users[i] = likedUserData
                                    break
                                }
                            }
                            if (!alreadyLiked) {
                                var likedUserData = {}
                                likedUserData.userId = req.query.userId
                                likedUserData.status = 3
                                likedUserData.type = "admin"
                                likedUserData.createdDateTime = utils.dateInUTC()
                                eventData.users[eventData.users.length] = likedUserData
                            }
                        }
                        else{
                            res.send("No User Found")
                        }

                        eventData.membersCount = eventData.users.length

                        eventData.save(function (err) {
                            if (err) {
                                logger.debug('eventData save Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "ERROR" })
                            } else {
                                var responceObj = {}
                               // responceObj.eventId = eventData._id
                                responceObj.userName=data.userName
                                responceObj.profileImage=data.profileImage
                                responceObj.userId = req.query.userId
                                responceObj.membersCount = eventData.users.length
                                responceObj.joinStatus = req.query.joinStatus
                                res.json({ statusCode: 1, statusMessage: "Success", data: responceObj })
                            }
                        })
                    } 
                    else{
                        res.json("AdminId is not a valid adminId")
                    }
                })
            }
             else {
                res.json(response)
            }
        }
    })
})




router.get('/deleteusers', function (req, res) {
    var input = req.query
    logger.debug('::: likeorUnlikeForEvent ::: ' + 'userId : ' + input.userId + ', eventId : ' + input.eventId + ', Admin : ' + input.adminId);
    var response = { statusCode: 2 }
    validateRequest(input, response)
    userProfile.findById({ _id: input.userId }, function (err, data) {
        if (err) {
            logger.debug('userProfile Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "Bad Request", data: null })
        } else if (!data) {
            logger.debug("InValid UserId"); res.json({ statusCode: 3, statusMessage: "InValid UserId", data: null })
        } else {
            if (response.statusCode != 0) {
                eventsModel.findById(input.eventId,function (err, eventData) {
                    if (err) {
                        logger.debug('eventData Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "Error", data: null })
                    } else if (!eventData) {
                        logger.debug("No Event found"); res.json({ statusCode: 3, statusMessage: "Bad Request", data: null })
                    } else if(eventData.userId==input.adminId){
                        
                          for (var i = 0; i < eventData.users.length; i++) {
                                if (req.query.userId === String(eventData.users[i].userId)) {
                                    eventData.users.splice(i, 1)
                                    break
                                }
                            }

                        eventData.membersCount = eventData.users.length
                        var responceObj = {}
                               // responceObj.eventId = eventData._id
                                responceObj.userName=data.userName
                                responceObj.profileImage=data.profileImage
                                responceObj.userId = req.query.userId
                                responceObj.membersCount = eventData.users.length
                                responceObj.joinStatus = req.query.joinStatus
                                res.json({ statusCode: 1, statusMessage: "Success", data: responceObj })

              
                    } 
                    else{
                        res.json("Given adminId is not an admin for this event")
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
    } else if (!utils.isValidObjectID(input.eventId)) {
        response.statusCode = 0; response.statusMessage = "invalid eventId"
    }
    if (!utils.isValidObjectID(input.adminId)) {
        response.statusCode = 0; response.statusMessage = "invalid AdminId"
    }
}

module.exports = router