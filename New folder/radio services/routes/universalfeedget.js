var express = require('express')
var mongoose = require('../mongodb/Connections')
var mongoose1 = require('mongoose')
var router = express.Router()
var logger = require('../logger')
var utils = require('../routes/Utils')
var ObjectId = require('mongodb').ObjectID;
let userProfile = require('../mongodb/schemas/UserProfile')
var feedsModel = require('../mongodb/schemas/ufeeds')


router.get('/', function (req, res) {
    var input = req.query;
    var response = { statusCode: 1 }
    validateRequest(input, response);
    if (response.statusCode != 0) {
        userProfile.findById(input.userId, function (err, data) {
            if (err) {
                logger.debug('userProfileModel Error');
                logger.debug(err);
                res.json({ statussCode: 0, statusMessage: "ERROR" })
            } else if (!data) {
                logger.debug("InValid uuserId");
                res.json({ statusCode: 0, statusMessage: "No User Found" })
            }
            else {
                feedsModel.find().sort({ _id: -1 }).populate({ path: 'userId' }).exec(function (err, feedsdata) {
                    if (err) {
                        logger.debug('feedsModel Error');
                        logger.debug(err);
                        res.json({ statusCode: 0, statusMessage: "Error" })
                    } else if (!feedsdata) {
                        logger.debug('eventsModel- No Events are not matched for this criteria')
                        res.json({ statusCode: 0, statusMessage: "No FanClubs are not matched for this criteria " })
                    } else {

                        var feedsArray = []
                        for (var i = 0; i < feedsdata.length; i++) {
                            let feedsObj = {}
                            let feeds = feedsdata[i];
                            //eventObj = event.toObject();
                            feedsObj = new Object()
                            feedsObj.feedsId = feeds._id
                            feedsObj.description = feeds.feedsDescription
                            feedsObj.feedsImageUrl = feeds.feedsImageUrl
                            feedsObj.createdDateTime = feeds.createdDateTime
                            feedsObj.createdUserId = feeds.userId._id
                            feedsObj.createdUserName = feeds.userId.fullName
                            feedsObj.createdUserProfileImage = feeds.userId.profileImage
                           
                            feedsArray.push(feedsObj);
                        }
                    }
                    res.json({ statusCode: 1, statusMessage: 'Success', data: feedsArray })
                })
            }

        })
    }
});

function validateRequest(input, response) {
    if (!utils.isValidObjectID(input.userId)) {
        response.statusCode = 0; response.statusMessage = "invalid userId"
    }
}

router.get('/getusers',function(req,res){
    feedsModel.find().populate({ path:'userId' }).exec(function(err,users){
    if(err){
        res.send("ERROR")
    }
    else{
        res.json({statuscode:1,StatusMessage:"Success",data:users})
    }
});
})

    
module.exports = router