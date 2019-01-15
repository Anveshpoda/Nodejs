let express = require('express')
let mongoose = require('../mongodb/Connections')
let mongoose1 = require('mongoose')
let router = express.Router()
let utils = require('../routes/Utils')
let logger = require('../logger')
let ObjectId = require('mongodb').ObjectID;
let userProfile = require('../mongodb/schemas/UserProfile')
let StoreModel = require('../mongodb/schemas/store')

let flag = false
router.post('/', function (req, res){
    flag = false
    let input = req.body
    let response = { statusCode: 1, statusMessage: "Success" }
    if (input.storeId) {
        storeValidation(input, response)
        if (response.statusCode != 0) {
            // logger.debug(' ::: UpdateFkEvent ::: ')
            // if (input.eventId) {
            StoreModel.findOneAndUpdate({ _id: input.storeId, userId: input.userId }, {
                $set: {
                    storeName: input.storeName,
                    storeLocation: input.storeLocation,
                    mobileNumber: input.mobileNumber,
                    latitude: input.latitude,
                    longitude: input.longitude,
                    email: input.email,
                    website: input.website,
                    
                }
            }, function (err, storedata) {
                if (err) {
                    // logger.debug('->StoreModel Error'); logger.debug(err)
                    res.json({ statusCode: 0, statusMessage: "No storeId  are not matched for this criteria" })
                } else if (storedata) {
                    // logger.debug('->Store updated')
                    res.json({ statusCode: 1, statusMessage: "Store updated"})
                }
                else {
                    res.json(response)
                }
            })
        }
        else {
            res.json(response)
        }
        
    } else {
        // logger.debug(' ::: createStore ::: ')
        userProfile.findById({ _id: input.userId }, function (err, data) {
            if (err) {
                console.log('->UserProfileModel Error');
                 // logger.debug(err)
                res.json({ statussCode: 0, statusMessage: "Error" })
            } else if (!data) {
                console.log('->InValid UserId'); res.json({ statusCode: 0, statusMessage: "InValid UserId" })
                // logger.debug('->InValid UserId')
            } else {   /*CreateEvent*/
                storeValidation(input, response)
                if (response.statusCode != 0) {
                    // let reasonId = '593501b80b0cbbe593cd7235'/*Event creation*/
                    let createStore = new StoreModel({})
                    createStore.userId = input.userId
                    createStore.storeName = input.storeName
                    createStore.storeLocation = input.storeLocation
                    createStore.mobileNumber = input.mobileNumber                    
                    createStore.geo = [input.latitude,input.longitude]
                    createStore.email = input.email
                    createStore.website = input.website
                    createStore.createdDateTime = utils.dateInUTC()
                    createStore.save(function (err, data) {
                        if (err) {
                            console.log('->Store save Error');
                            // logger.debug(err);
                            res.json({ statusCode: 0, statusMessage: "something went wrong" })
                        } else {
                            res.json({ statusCode: 1, statusMessage: ' New Store Created', data: createStore })
                            // logger.debug(':::Store Created:::');                                                        
                        }
                    })
                } else {
                    res.json(response)
                }
            }
        })
    }
});





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
                StoreModel.find({_id: input.storeId},function (err, storedata) {
                    if (err) {
                        logger.debug('groupsModel Error');
                        logger.debug(err);
                        res.json({ statusCode: 0, statusMessage: "Error" })
                    } else if (!storedata) {
                        logger.debug('groupsModel- No Events are not matched for this criteria')
                        res.json({ statusCode: 0, statusMessage: "No FanClubs are not matched for this criteria " })
                    } else {
  
                  
                        
                        var storesArray = []
                        for (var i = 0; i < storedata.length; i++) {
                            let storeObj = {}
                            let store = storedata[i].comments; 
                            for(var j=0;j<store.length;j++){
                            if(input.wallId==store[j].wallId){
                           
                             storeObj = new Object()
                             storeObj=store[j]
                            
                             storesArray.push(storeObj);

                        }

                    }
                    res.json({ statusCode: 1, statusMessage: 'Success', data: storesArray })
        }    
       }        
     })                    
   }
  })
})

// post for comments
router.post('/comments', function (req, res) {
    var input = req.body
    logger.debug('::: likeorUnlikeForEvent ::: ' + 'userId : ' + input.userId + ', groupId : ' + input.storeId + ', wallId : ' +input.wallId);
    var response = { statusCode: 2 }
     validateRequest(input, response)
    userProfile.findById({ _id: input.userId }, function (err, data) {
        if (err) {
            logger.debug('userProfile Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "Bad Request", data: null })
        } else if (!data) {
            logger.debug("InValid UserId"); res.json({ statusCode: 3, statusMessage: "Bad Request", data: null })
        } else {
            if (response.statusCode != 0) {
                StoreModel.findById(input.storeId, function (err, storeData) {
                    if (err) {
                        logger.debug('eventData Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "Error", data: null })
                    } else if (!storeData) {
                        logger.debug("No Event found"); res.json({ statusCode: 3, statusMessage: "Bad Request", data: null })
                    } else {
                        for(var i=0;i<storeData.wall.length;i++){
                            if(storeData.wall[i]._id==input.wallId){
                        
                       
                        var postComment={
                        userId : input.userId,
                        comment : input.comment,
                        wallId : input.wallId
                    }
                        // postComment.groupImageUrl=input.imageUrl
                        // postComment.createdDate = utils.dateInUTC()
                        storeData.comments[storeData.comments.length] = postComment
                        storeData.membersCount = storeData.comments.length

                        storeData.save(function (err) {
                            if (err) {
                                logger.debug('storeData save Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "ERROR" })
                            } else {
                                var responceObj = {}
                               
                            
                            var wallcomments = 0
                            for (let i = 0; i < storeData.comments.length; i++) {
                                if (storeData.comments[i].wallId === input.wallId )
                                    wallcomments++
                            }
                        
                             // responceObj.eventId = eventData._id
                                // responceObj.feedcommentsCount=comments
                                 responceObj.wallcommentsCount=wallcomments
                                responceObj.userName=data.userName
                                responceObj.profileImage=data.profileImage
                                responceObj.userId = input.userId
                                responceObj.membersCount = storeData.comments.length
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



router.post('/wall', function (req, res) {
    var input = req.body
    logger.debug('::: likeorUnlikeForEvent ::: ' + 'userId : ' + input.userId + ', groupId : ' + input.storeId );
    var response = { statusCode: 2 }
    // validateRequest(input, response)
    userProfile.findById({_id: input.userId }, function (err, data) {
        if (err) {
            logger.debug('userProfile Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "Bad Request", data: null })
        } else if (!data) {
            logger.debug("InValid UserId"); res.json({ statusCode: 3, statusMessage: "Bad Request", data: null })
        } else {
            if (response.statusCode != 0) {
                StoreModel.findById({_id:input.storeId},function (err, storeData) {
                    if (err) {
                        logger.debug('eventData Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "Error", data: null })
                    } else if (!storeData) {
                        logger.debug("No Event found"); res.json({ statusCode: 3, statusMessage: "Bad Request", data: null })
                    } else {
                         
                        
                        let postFeed = new StoreModel()
                        postFeed.userId = input.userId
                        postFeed.description = input.description
                        postFeed.imageUrl=input.imageUrl
                        postFeed.createdDate = utils.dateInUTC()
                        storeData.wall[storeData.wall.length] = postFeed
                        storeData.save(function (err) {
                            if (err) {
                                logger.debug('storeData save Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "ERROR" })
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
    } else if (!(utils.isValidObjectID(input.groupId) || utils.isValidObjectID(input.storeId)))
     {
        response.statusCode = 0; response.statusMessage = "invalid groupId or storeId"
    }
    else if (!(utils.isValidObjectID(input.feedId) || utils.isValidObjectID(input.wallId))) {
            response.statusCode = 0; response.statusMessage = "invalid feedId or wallId"
        } 
    
}




module.exports = router














function storeValidation(input, response) {
    if (flag)
        if (!utils.isValidObjectID(input.storeId)) {
            response.statusCode = 0; response.statusMessage = "InValid storeId"
        }
    // 
    //  if (utils.isStringBlank(input.invitedBy)) {
    //     response.statusCode = 0; response.statusMessage = "invitedBy should be String"
    // } else if (input.invitedBy.length > 75) {
    //     response.statusCode = 0; response.statusMessage = "invitdBy length is out of range"
    // } else if (utils.isStringBlank(input.eventTitle)) {
    //     response.statusCode = 0; response.statusMessage = "eventTitle is Mandatory and eventTitle should be String"
    // } else if (input.eventTitle.trim().length > 30) {
    //     response.statusCode = 0; response.statusMessage = "eventTitle filed length should not be greater than 30"
    // } else if (utils.isStringBlank(input.eventImageUrl)) {
    //     response.statusCode = 0; response.statusMessage = "eventImageUrl  is Mandatory"
    // } else
    /* if (utils.isStringBlank(input.storeLocation)) {
        response.statusCode = 0; response.statusMessage = "eventLocation  should be String"
    }*/
    else if (!utils.isValidObjectID(input.userId)) {
        response.statusCode = 0; response.statusMessage = "InValid UserId"
    } 
    // else if (isNaN(parseInt(input.joinStatus)) || !(input.joinStatus == 0)) {
    //     response.statusCode = 0; response.statusMessage = "Enter a valid Status ID for Event Create or Update."
    // }
}

module.exports = router