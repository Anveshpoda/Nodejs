

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
    logger.debug('::: likeorUnlikeForEvent ::: ' + 'userId : ' + input.userId + ', eventId : ' + input.eventId + ', Status : ' + input.joinStatus);
    var response = { statusCode: 2 }
    validateRequest(input, response)
    userProfile.findById({ _id: input.userId }, function (err, data) {
        if (err) {
            logger.debug('userProfile Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "Bad Request", data: null })
        } else if (!data) {
            logger.debug("InValid UserId"); res.json({ statusCode: 3, statusMessage: "InValid UserId", data: null })
        } else {
            if (response.statusCode != 0) {
                eventsModel.findById(input.eventId, function (err, eventData) {
                    if (err) {
                        logger.debug('eventData Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "Error", data: null })
                    } else if (!eventData) {
                        logger.debug("No Event found"); res.json({ statusCode: 3, statusMessage: "Bad Request", data: null })
                    } else {

                        if(!(eventData.userId==input.userId)){
                        var isJoinedUser = false
                        if (req.query.joinStatus == '2') {
                            var alreadyLiked = false
                            for (var i = 0; i < eventData.users.length; i++) {
                                if (req.query.userId === String(eventData.users[i].userId)) {
                                    alreadyLiked = true
                                    var likedUserData = {}
                                    likedUserData.userId = req.query.userId
                                    likedUserData.type = "user"
                                    likedUserData.status = req.query.joinStatus
                                    eventData.users[i] = likedUserData
                                    break
                                }
                            }
                            if (!alreadyLiked) {
                                var likedUserData = {}
                                likedUserData.userId = req.query.userId
                                likedUserData.status = req.query.joinStatus
                                likedUserData.type = "user"
                                likedUserData.createdDateTime = utils.dateInUTC()
                                eventData.users[eventData.users.length] = likedUserData
                            }
                        }
                        else if (req.query.joinStatus == '1') {
                            var alreadyLiked = false
                            for (var i = 0; i < eventData.users.length; i++) {
                                if (req.query.userId === String(eventData.users[i].userId)) {
                                    alreadyLiked = true
                                    var likedUserData = {}
                                    likedUserData.userId = req.query.userId
                                    likedUserData.type = "user"
                                    likedUserData.status = req.query.joinStatus
                                    eventData.users[i] = likedUserData
                                    break
                                }
                            }
                            if (!alreadyLiked) {
                                var likedUserData = {}
                                likedUserData.userId = req.query.userId
                                likedUserData.type = "user"
                                likedUserData.status = req.query.joinStatus
                                likedUserData.createdDateTime = utils.dateInUTC()
                                eventData.users[eventData.users.length] = likedUserData
                            }
                        } 
                         else {
                            var alreadyLiked = false
                            for (var i = 0; i < eventData.users.length; i++) {
                                if (req.query.userId === String(eventData.users[i].userId)) {
                                    alreadyLiked = true
                                    var likedUserData = {}
                                    likedUserData.userId = req.query.userId
                                    likedUserData.type = "user"
                                    likedUserData.status = req.query.joinStatus
                                    eventData.users[i] = likedUserData
                                    break
                                }
                            }
                            if (!alreadyLiked) {
                                var likedUserData = {}
                                likedUserData.userId = req.query.userId
                                likedUserData.status = req.query.joinStatus
                                likedUserData.type = "user"
                                likedUserData.createdDateTime = utils.dateInUTC()
                                eventData.users[eventData.users.length] = likedUserData
                            }
                        }
                   
                           

                        eventData.membersCount = eventData.users.length
                         // var yesCount = 0
                         //    for (let m = 0; m < eventData.users.length; m++) {
                         //        if (eventData.users[m].status === 3 )
                         //            yesCount++
                         //    }
                         //    if(yesCount == eventData.requireMembers){
                         //        res.send("event ended")
                         //    } else{

                        eventData.save(function (err) {
                            if (err) {
                                logger.debug('eventData save Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "ERROR" })
                            } else {
                                     var yesCount = 0
                            for (let m = 0; m < eventData.users.length; m++) {
                                if (eventData.users[m].status === 3 )
                                    yesCount++
                            }
                            
                            var maybeCount = 0
                            for (let m = 0; m < eventData.users.length; m++) {
                                if (eventData.users[m].status === 2 )
                                    maybeCount++
                            }
                            
                            var noCount = 0
                            for (let m = 0; m < eventData.users.length; m++) {
                                if (eventData.users[m].status === 1 )
                                    noCount++
                            }
                           
                            var noresponse = 0
                            for (let m = 0; m < eventData.users.length; m++) {
                                if (eventData.users[m].status === 0 )
                                    noresponse++
                            }
                                var responceObj = {}
                               // responceObj.eventId = eventData._id
                                responceObj.yesCount = yesCount
                                responceObj.maybeCount = maybeCount
                                responceObj.noCount = noCount
                                responceObj.noresponse = noresponse
                                responceObj.userName=data.userName
                                responceObj.profileImage=data.profileImage
                                responceObj.userId = req.query.userId
                                // responceObj.membersCount = eventData.users.length
                                responceObj.joinStatus = req.query.joinStatus
                                res.json({ statusCode: 1, statusMessage: "Success", data: responceObj })
                               }
                        })
                        
                        // }
                    }
                    else{
                        res.json("Invalid response")
                    }
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
    if (!(input.joinStatus == '2' || input.joinStatus == '3' || input.joinStatus=='1')) {
        response.statusCode = 0; response.statusMessage = "invalid joinStatus"
    }
}

module.exports = router