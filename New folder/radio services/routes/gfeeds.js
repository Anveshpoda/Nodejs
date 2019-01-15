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
                // groupsModel.find({_id: input.groupId},function (err, groupdata) {
                //     if (err) {
                //         logger.debug('groupsModel Error');
                //         logger.debug(err);
                //         res.json({ statusCode: 0, statusMessage: "Error" })
                //     } else if (!groupdata) {
                //         logger.debug('groupsModel- No Events are not matched for this criteria')
                //         res.json({ statusCode: 0, statusMessage: "No FanClubs are not matched for this criteria " })
                //     } else {

                    groupsModel.aggregate([{ $match : { _id : ObjectId(input.groupId) } },
                      {"$unwind": "$wall"}, 
                      {"$sort": {"_id": 1, "wall.createdDateTime": -1}}, 
                      {"$group": {"_id": "$_id","wall": {"$push": "$wall"},"likes": {"$first": "$likes"}}}
                    ]).exec(function (err, groupdata) {
                    if (err) {
                        logger.debug('groupsModel Error');
                        logger.debug(err);
                        res.json({ statusCode: 0, statusMessage: "Error" })
                    } else if (!groupdata) {
                        logger.debug('groupsModel- No Events are not matched for this criteria')
                        res.json({ statusCode: 0, statusMessage: "No FanClubs are not matched for this criteria " })
                    } else {

                        var groupsArray = []
                        var wallArray=[]
                        for (var i = 0; i < groupdata.length; i++) {
                            let groupObj = {}
                            let group = groupdata[i];
                            //eventObj = event.toObject();
                            groupObj = new Object()
                            groupObj.groupId = group._id
                            groupObj.fullName=data.userName
                            groupObj.profileImage=data.profileImage
                            for(var j = 0;j < group.wall.length; j++){
                            let wallObj = {}
                            let wall = group.wall[j];
                            wallObj = new Object()
                            wallObj.wallId=wall._id
                            wallObj.description=wall.description
                            wallObj.imageUrl=wall.imageUrl
                            wallObj.createdDateTime=wall.createdDateTime
                            var likes = 0
                            for (let m = 0; m < group.likes.length; m++) {
                            if (group.likes[m].wallId ==wall._id )
                              likes++
                            }
                            wallObj.likes=likes
                            wallArray.push(wallObj);
                            }

                            // groupObj.comments=group.comments
                            groupsArray.push(wallArray);
                        }
                        // groupsModel.populate(groupsArray, {path: "wall.userId"}, function(err,result){
                        //     if(err)
                        //         res.send("ERROR")
                        //     else
                        //          res.json({ statusCode: 1, statusMessage: 'Success', data: result })
                        // });
                        res.json({ statusCode: 1, statusMessage: 'Success', data: groupsArray })
                    }
                    
                })
                        // var groupsArray = []
                        // for (var i = 0; i < groupdata.length; i++) {
                        //     let groupObj = {}
                        //     let group = groupdata[i];
                        //     //eventObj = event.toObject();
                        //     groupObj = new Object()
                        //     groupObj.groupId = group._id
                        //     //groupObj.groupName = group.groupName
                        //     //groupObj.description = group.description
                        //     //groupObj.groupImageUrl = group.groupImageUrl
                        //     //groupObj.category = group.category
                        //     //groupObj.hashTag = group.hashTag
                        //     //groupObj.keywords = group.keywords
                        //     //groupObj.createdDateTime = group.createdDateTime
                        //     groupObj.gfeeds=group.gfeeds
                        //     //groupObj.createdUserId = group.userId._id
                        //     //groupObj.createdUserName = group.userId.fullName
                        //     //groupObj.createdUserProfileImage = group.userId.profileImage
                        //     groupsArray.push(groupObj);
                        // }
                    // }
                    // res.json({ statusCode: 1, statusMessage: 'Success', data: groupsArray })
        //         }
            
        // })
}
})

})
// router.get('/admin', function (req, res) {
//     var input = req.query;
//     var response = { statusCode: 1 }
// userProfile.findById({ _id: input.userId }, function (err, data) {
//     if (err) {
//                 logger.debug('userProfileModel Error');
//                 logger.debug(err);
//                 res.json({ statussCode: 0, statusMessage: "ERROR" })
//             } else if (!data) {
//                 logger.debug("InValid UserId");
//                 res.json({ statusCode: 0, statusMessage: "No User Found" })
//             }
//             else {
//                 groupsModel.find({_id: input.groupId}).populate({ path: 'wall.userId' }).exec(function (err, groupdata) {
//                     if (err) {
//                         logger.debug('groupsModel Error');
//                         logger.debug(err);
//                         res.json({ statusCode: 0, statusMessage: "Error" })
//                     } else if (!groupdata) {
//                         logger.debug('groupsModel- No Events are not matched for this criteria')
//                         res.json({ statusCode: 0, statusMessage: "No FanClubs are not matched for this criteria " })
//                     } else {

//                         var groupsArray = []
//                         for (var i = 0; i < groupdata.length; i++) {
//                             let groupObj = {}
//                             let group = groupdata[i];
//                             //eventObj = event.toObject();
//                             groupObj = new Object()
//                             groupObj.groupId = group._id
//                             //groupObj.groupName = group.groupName
//                             //groupObj.description = group.description
//                             //groupObj.groupImageUrl = group.groupImageUrl
//                             //groupObj.category = group.category
//                             //groupObj.hashTag = group.hashTag
//                             //groupObj.keywords = group.keywords
//                             //groupObj.createdDateTime = group.createdDateTime
//                             groupObj.wall=group.wall
//                             groupObj.createdUserId = group.userId._id
//                             groupObj.createdUserName = group.userId.fullName
//                             groupObj.createdUserProfileImage = group.userId.profileImage
//                             groupsArray.push(groupObj);
//                         }
//                     }
//                     res.json({ statusCode: 1, statusMessage: 'Success', data: groupsArray })
//                 })
//             }
//         })

// })
// GET list of groups FROM THE DATABASE
router.get('/admin', function (req, res) {
    var input = req.query;
    var response = { statusCode: 1 }
    //validateRequest(input, response);
    if (response.statusCode != 0) {
                   groupsModel.find({_id: input.groupId}).sort({createdDate:-1}).populate({ path: 'wall.userId' }).exec(function (err, feeddata) {
                    if (err) {
                        logger.debug('feedsModel Error');
                        logger.debug(err);
                        res.json({ statusCode: 0, statusMessage: "Error" })
                    } else if (!feeddata) {
                        logger.debug('feedsModel- No Feeds are not matched for this criteria')
                        res.json({ statusCode: 0, statusMessage: "No Feeds are not matched for this criteria " })
                    } else {

                        var feedsArray = []
                      for (var i = 0; i < feeddata.length; i++) {
                            let feedObj = {}
                            let feed = feeddata[i];
                            feedObj = new Object()
                            feedObj.username=feed.userId.userName
                            feedObj.profileImage=feed.userId.profileImage
                            feedObj.wall=feed.wall
                            feedsArray.push(feedObj);
                        }
                    }
                    res.json({ statusCode: 1, statusMessage: 'Success', data: feedsArray })
                      })                  }

        })



function validateRequest(input, response) {
    if (!utils.isValidObjectID(input.userId)) {
        response.statusCode = 0; response.statusMessage = "invalid userId"
    }
}






router.post('/admin', function (req, res) {
    var input = req.body
    logger.debug('::: likeorUnlikeForEvent ::: ' + 'userId : ' + input.userId + ', groupId : ' + input.groupId );
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
                        if(groupData.userId==input.userId){
                        let postFeed = new groupsModel({})
                        postFeed.userId = input.userId
                        postFeed.description = input.description
                        postFeed.groupImageUrl=input.imageUrl
                        postFeed.createdDate = utils.dateInUTC()
                        groupData.wall[groupData.wall.length] = postFeed
                        groupData.membersCount = groupData.wall.length

                        groupData.save(function (err) {
                            if (err) {
                                logger.debug('groupData save Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "ERROR" })
                            } else {
                                var responceObj = {}
                               // responceObj.eventId = eventData._id
                                responceObj.userName=data.userName
                                responceObj.profileImage=data.profileImage
                                responceObj.userId = input.userId
                                responceObj.membersCount = groupData.users.length
                                res.json({ statusCode: 1, statusMessage: "Success", data: responceObj })
                            }
                        })
                    }else{
                        res.json({statusCode:0,message:'user must be an admin'})
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
router.post('/users', function (req, res) {
    var input = req.body
    logger.debug('::: likeorUnlikeForEvent ::: ' + 'userId : ' + input.userId + ', groupId : ' + input.groupId );
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
                       
                        let postFeed = new groupsModel({})
                        postFeed.userId = input.userId
                        postFeed.description = input.description
                        postFeed.groupImageUrl=input.imageUrl
                        postFeed.createdDate = utils.dateInUTC()
                        groupData.gfeeds[groupData.gfeeds.length] = postFeed
                        groupData.membersCount = groupData.gfeeds.length

                        groupData.save(function (err) {
                            if (err) {
                                logger.debug('groupData save Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "ERROR" })
                            } else {
                                var responceObj = {}
                               // responceObj.eventId = eventData._id
                                responceObj.userName=data.userName
                                responceObj.profileImage=data.profileImage
                                responceObj.userId = input.userId
                                responceObj.membersCount = groupData.users.length
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