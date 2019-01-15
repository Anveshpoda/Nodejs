'use strict'
let express = require('express')
let mongoose = require('../mongodb/Connections')
let router = express.Router()
let utils = require('../routes/Utils')
let logger = require('../logger')
let ObjectId = require('mongodb').ObjectID;
let userProfileModel = require('../mongodb/schemas/UserProfile')
let groupsModel = require('../mongodb/schemas/Groups')

// GET list of groups FROM THE DATABASE
router.get('/', function (req, res) {
    var input = req.query;
    var response = { statusCode: 1 }
    //validateRequest(input, response);
    if (response.statusCode != 0) {
                   groupsModel.find({_id: input.groupId }).populate({ path: 'userId' }).exec(function (err, groupdata) {
                    if (err) {
                        logger.debug('eventsModel Error');
                        logger.debug(err);
                        res.json({ statusCode: 0, statusMessage: "Error" })
                    } else if (!groupdata) {
                        logger.debug('eventsModel- No Events are not matched for this criteria')
                        res.json({ statusCode: 0, statusMessage: "No FanClubs are not matched for this criteria " })
                    } else {

                        var groupsArray = []
                        for (var i = 0; i < groupdata.length; i++) {
                            let groupObj = {}
                            let group = groupdata[i];
                            //eventObj = event.toObject();
                            groupObj = new Object()
                            groupObj.groupId = group._id
                            //groupObj.groupName = group.groupName
                            //groupObj.description = group.description
                            //groupObj.groupImageUrl = group.groupImageUrl
                            //groupObj.category = group.category
                            //groupObj.hashTag = group.hashTag
                            //groupObj.keywords = group.keywords
                            //groupObj.createdDateTime = group.createdDateTime
                            groupObj.users=group.users
                            //groupObj.createdUserId = group.userId._id
                            //groupObj.createdUserName = group.userId.fullName
                            //groupObj.createdUserProfileImage = group.userId.profileImage
                            groupsArray.push(groupObj);
                        }
                    }
                    res.json({ statusCode: 1, statusMessage: 'Success', data: groupsArray })
                })
            }

        })

function validateRequest(input, response) {
    if (!utils.isValidObjectID(input.userId)) {
        response.statusCode = 0; response.statusMessage = "invalid userId"
    }
}

router.get('/groups', function (req, res) {
     groupsModel.find({},{"groupName":1}, function (err, groups) {
         if (err) return res.status(500).send("There was a problem finding the groups.");
         res.json({ statusCode: 200, statusMessage: 'Success!!!',data:groups})
          });
 });

module.exports = router