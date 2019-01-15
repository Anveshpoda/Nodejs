let express = require('express')
let mongoose = require('../mongodb/Connections')
let mongoose1 = require('mongoose')
let router = express.Router()
let utils = require('../routes/Utils')
let logger = require('../logger')
let ObjectId = require('mongodb').ObjectID;
let userProfile = require('../mongodb/schemas/UserProfile')
let groupsModel = require('../mongodb/schemas/Groups')
let feedsModel=require('../mongodb/schemas/Feeds')
router.post('/', function (req, res) {
    var input = req.body
    logger.debug('::: likeorUnlikeForEvent ::: ' + 'userId : ' + input.userId + ', groupId : ' + input.groupId );
    var response = { statusCode: 2 }
    validateRequest(input, response)
    userProfile.findById({_id: input.userId }, function (err, data) {
        if (err) {
            logger.debug('userProfile Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "Bad Request", data: null })
        } else if (!data) {
            logger.debug("InValid UserId"); res.json({ statusCode: 3, statusMessage: "Bad Request", data: null })
        } else {
            if (response.statusCode != 0) {
                groupsModel.findById({_id:input.groupId},function (err, groupData) {
                    if (err) {
                        logger.debug('eventData Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "Error", data: null })
                    } else if (!groupData) {
                        logger.debug("No Event found"); res.json({ statusCode: 3, statusMessage: "Bad Request", data: null })
                    } else {
                         
                        
                        let postFeed = new feedsModel()
                        postFeed.userId = input.userId
                        postFeed.description = input.description
                        postFeed.imageUrl=input.imageUrl
                        postFeed.createdDate = utils.dateInUTC()
                        groupData.feeds[groupData.gfeeds.length] = postFeed
                        groupData.save(function (err) {
                            if (err) {
                                logger.debug('groupData save Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "ERROR" })
                            } else {
                                   var responceObj = {}
                               // responceObj.eventId = eventData._id
                                responceObj.userName=data.fullName
                                responceObj.profileImage=data.profileImage
                                responceObj.userId = input.userId
                                responceObj.descripton=input.description
                                responceObj.imageUrl=input.imageUrl
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
    // if (!(input.joinStatus == '2' || input.joinStatus == '0' || input.joinStatus=='1')) {
    //     response.statusCode = 0; response.statusMessage = "invalid joinStatus"
    // }
}

module.exports = router