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
    logger.debug('::: likeorUnlikeForEvent ::: ' + 'userId : ' + input.userId + ', groupId : ' + input.groupId + ', Status : ' + input.joinStatus + ', feedId : ' +input.feedId);
    var response = { statusCode: 2 }
    validateRequest(input, response)
    userProfile.findById({ _id: input.userId }, function (err, data) {
        if (err) {
            logger.debug('userProfile Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "Bad Request", data: null })
        } else if (!data) {
            logger.debug("InValid UserId"); res.json({ statusCode: 3, statusMessage: "Bad Request", data: null })
        } else {
            if (response.statusCode != 0) {
                // for groupsModel
                if((input.groupId && input.userId && input.feedId || input.groupId && input.userId && input.wallId)){
                groupsModel.findById(input.groupId, function (err, groupData) {
                    if (err) {
                        logger.debug('eventData Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "Error", data: null })
                    } else if (!groupData) {
                        logger.debug("No Event found"); res.json({ statusCode: 3, statusMessage: "Bad Request", data: null })
                    } else {
                        // for feed likes
                       if((input.groupId && input.userId && input.feedId)){
                        var isJoinedUser = false
                        if (req.query.joinStatus == '1') {
                            var alreadyLiked = false
                            for (var i = 0; i < groupData.likes.length; i++) {
                                if ((req.query.userId === String(groupData.likes[i].userId)) && (req.query.feedId===String(groupData.likes[i].feedId))) {
                                    alreadyLiked = true
                                    break
                                }
                            }
                            if (!alreadyLiked) {
                                var likedUserData = {}
                                likedUserData.userId = req.query.userId
                                likedUserData.status = req.query.joinStatus
                                likedUserData.feedId = req.query.feedId
                                // likedUserData.createdDateTime = utils.dateInUTC()
                                groupData.likes[groupData.likes.length] = likedUserData
                            }
                        } 
                         else {
                            for (var i = 0; i < groupData.likes.length; i++) {
                                if (req.query.userId === String(groupData.likes[i].userId) && req.query.feedId === String(groupData.likes[i].feedId)) {
                                    groupData.likes.splice(i, 1)
                                    break
                                }
                            }
                        }

                        groupData.membersCount = groupData.likes.length

                        groupData.save(function (err) {
                            if (err) {
                                logger.debug('groupData save Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "ERROR" })
                            } else {
                                var responceObj = {}
                               // responceObj.eventId = eventData._id
                             var likes = 0
                            for (let m = 0; m < groupData.likes.length; m++) {
                                if (groupData.likes[m].feedId === input.feedId )
                                    likes++
                            }
                                responceObj.likesCount = likes
                                responceObj.userName=data.userName
                                responceObj.profileImage=data.profileImage
                                responceObj.userId = req.query.userId
                                // responceObj.membersCount = groupData.likes.length
                                responceObj.joinStatus = req.query.joinStatus
                                res.json({ statusCode: 1, statusMessage: "Success", data: responceObj })
                            }
                        })
                    }
                    // for wall likes
                        else{

                        var isJoinedUser = false
                        if (req.query.joinStatus == '1') {
                            var alreadyLiked = false
                            for (var i = 0; i < groupData.likes.length; i++) {
                                if ((req.query.userId === String(groupData.likes[i].userId)) && (req.query.wallId===String(groupData.likes[i].wallId))) {
                                    alreadyLiked = true
                                    break
                                }
                            }
                            if (!alreadyLiked) {
                                var likedUserData = {}
                                likedUserData.userId = req.query.userId
                                likedUserData.status = req.query.joinStatus
                                likedUserData.wallId = req.query.wallId
                                // likedUserData.createdDateTime = utils.dateInUTC()
                                groupData.likes[groupData.likes.length] = likedUserData
                            }
                        } 
                         else {
                            for (var i = 0; i < groupData.likes.length; i++) {
                                if (req.query.userId === String(groupData.likes[i].userId) && req.query.wallId === String(groupData.likes[i].wallId)) {
                                    groupData.likes.splice(i, 1)
                                    break
                                }
                            }
                        }

                        groupData.membersCount = groupData.likes.length

                        groupData.save(function (err) {
                            if (err) {
                                logger.debug('groupData save Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "ERROR" })
                            } else {
                                var responceObj = {}
                               // responceObj.eventId = eventData._id
                             var likes = 0
                            for (let m = 0; m < groupData.likes.length; m++) {
                                if (groupData.likes[m].wallId === input.wallId )
                                    likes++
                            }
                                responceObj.likesCount = likes
                                responceObj.userName=data.userName
                                responceObj.profileImage=data.profileImage
                                responceObj.userId = req.query.userId
                                // responceObj.membersCount = groupData.likes.length
                                responceObj.joinStatus = req.query.joinStatus
                                res.json({ statusCode: 1, statusMessage: "Success", data: responceObj })
                            }
                        })
                        }                    
                }
                })
        }
        // for storesModel 
            else{
                res.send("For Store Details");
            }
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
    } else if (!(utils.isValidObjectID(input.groupId) || utils.isValidObjectID(input.storeId)))
     {
        response.statusCode = 0; response.statusMessage = "invalid groupId or storeId"
    }
    else if (!(utils.isValidObjectID(input.feedId) || utils.isValidObjectID(input.wallId))) {
            response.statusCode = 0; response.statusMessage = "invalid feedId or wallId"
        } 
    if (!(input.joinStatus == '0' || input.joinStatus=='1')) {
        response.statusCode = 0; response.statusMessage = "invalid joinStatus"
    }
}
// getting comments of feeds or walls
router.get('/comments', function (req, res) {
    var input = req.query;
    var response = { statusCode: 1 }
userProfile.findById({ _id: input.userId }, function (err, data) {
    if (err) {
                logger.debug('userProfileModel Error');
                logger.debug(err);
                res.json({ statussCode: 0, statusMessage: "ERROR" })
            } else if (!data) {
                logger.debug("InValid UserId");
                res.json({ statusCode: 0, statusMessage: "No User Found" })
            }
            else {
                groupsModel.find({_id: input.groupId},function (err, groupdata) {
                    if (err) {
                        logger.debug('groupsModel Error');
                        logger.debug(err);
                        res.json({ statusCode: 0, statusMessage: "Error" })
                    } else if (!groupdata) {
                        logger.debug('groupsModel- No Events are not matched for this criteria')
                        res.json({ statusCode: 0, statusMessage: "No FanClubs are not matched for this criteria " })
                    } else {
  
                  
                        if(input.groupId && input.userId && input.feedId){
                        var groupsArray = []
                        for (var i = 0; i < groupdata.length; i++) {
                            let groupObj = {}
                            let group = groupdata[i].comments; 
                            for(var j=0;j<group.length;j++){
                            if(input.feedId==group[j].feedId){
                           
                             groupObj = new Object()
                             groupObj=group[j]
                            
                             groupsArray.push(groupObj);

                        }

                    }
                    res.json({ statusCode: 1, statusMessage: 'Success', data: groupsArray })
        } 
        }
        else if(input.groupId && input.userId && input.wallId){
            var groupsArray = []
                        for (var i = 0; i < groupdata.length; i++) {
                            let groupObj = {}
                            let group = groupdata[i].comments; 
                            for(var j=0;j<group.length;j++){
                            if(input.wallId==group[j].wallId){
                           
                             groupObj = new Object()
                             groupObj=group[j]
                            
                             groupsArray.push(groupObj);

                        }

                    }
                    res.json({ statusCode: 1, statusMessage: 'Success', data: groupsArray })
        } 

        }
        else{
            res.send("No comments found for given feedId or wallId")
        }          
       }        
     })                    
   }
  })
})

// post for comments
router.post('/comments', function (req, res) {
    var input = req.body
    logger.debug('::: likeorUnlikeForEvent ::: ' + 'userId : ' + input.userId + ', groupId : ' + input.groupId + ', feedId : ' +input.feedId);
    var response = { statusCode: 2 }
    // validateRequest(input, response)
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
                        for(var i=0;i<groupData.gfeeds.length;i++){
                            if(groupData.gfeeds[i]._id==input.feedId){
                        
                       
                        var postComment={
                        userId : input.userId,
                        comment : input.comment,
                        feedId : input.feedId
                    }
                        // postComment.groupImageUrl=input.imageUrl
                        // postComment.createdDate = utils.dateInUTC()
                        groupData.comments[groupData.comments.length] = postComment
                        groupData.membersCount = groupData.comments.length

                        groupData.save(function (err) {
                            if (err) {
                                logger.debug('groupData save Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "ERROR" })
                            } else {
                                var responceObj = {}
                                if(input.groupId && input.userId && input.feedId){
                                var comments = 0
                            for (let m = 0; m < groupData.comments.length; m++) {
                                if (groupData.comments[m].feedId === input.feedId )
                                    comments++
                            }
                        }
                            if(input.groupId && input.userId && input.wallId){
                            var wallcomments = 0
                            for (let i = 0; i < groupData.comments.length; i++) {
                                if (groupData.comments[i].wallId === input.wallId )
                                    wallcomments++
                            }
                        }
                               // responceObj.eventId = eventData._id
                                responceObj.feedcommentsCount=comments
                                // responceObj.wallcommentsCount=wallcomments
                                responceObj.userName=data.userName
                                responceObj.profileImage=data.profileImage
                                responceObj.userId = input.userId
                                responceObj.membersCount = groupData.comments.length
                                res.json({ statusCode: 1, statusMessage: "Success", data: responceObj })
                            }
                        })
                    }
                    }



                               for(var i=0;i<groupData.wall.length;i++){
                            if(groupData.wall[i]._id==input.wallId){
                        
                       
                        var postComment={
                        userId : input.userId,
                        comment : input.comment,
                        
                        wallId :input.wallId
                    }
                        // postComment.groupImageUrl=input.imageUrl
                        // postComment.createdDate = utils.dateInUTC()
                        groupData.comments[groupData.comments.length] = postComment
                        groupData.membersCount = groupData.comments.length

                        groupData.save(function (err) {
                            if (err) {
                                logger.debug('groupData save Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "ERROR" })
                            } else {
                                var responceObj = {}
                                
                            if(input.groupId && input.userId && input.wallId){
                            var wallcomments = 0
                            for (let i = 0; i < groupData.comments.length; i++) {
                                if (groupData.comments[i].wallId === input.wallId )
                                    wallcomments++
                            }
                        }
                               // responceObj.eventId = eventData._id
                                // responceObj.feedcommentsCount=comments
                                responceObj.wallcommentsCount=wallcomments
                                responceObj.userName=data.userName
                                responceObj.profileImage=data.profileImage
                                responceObj.userId = input.userId
                                responceObj.membersCount = groupData.comments.length
                                res.json({ statusCode: 1, statusMessage: "Success", data: responceObj })
                            }
                        })
                    }
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




module.exports = router