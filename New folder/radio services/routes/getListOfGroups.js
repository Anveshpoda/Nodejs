/*'use strict'
let express = require('express')
let mongoose = require('../mongodb/Connections')
let mongoose1 = require('mongoose')
let router = express.Router()
let utils = require('../routes/Utils')
let logger = require('../logger')
let ObjectId = require('mongodb').ObjectID;
let groupsModel = require('../mongodb/schemas/Groups')

// GET list of groups FROM THE DATABASE
router.get('/:id', function (req, res) {
    groupsModel.findById({_id:input.groupId},{"users":1}, function (err, groups) {
        if (err) return res.status(500).send("There was a problem finding the groups.");
        res.json({ statusCode: 200, statusMessage: 'Success!!!',data:groups})
         });
});
module.exports = router;*/
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
    validateRequest(input, response);
    if (response.statusCode != 0) {
        userProfileModel.findById({ _id: input.userId }, function (err, data) {
            if (err) {
                logger.debug('userProfileModel Error');
                logger.debug(err);
                res.json({ statussCode: 0, statusMessage: "ERROR" })
            } else if (!data) {
                logger.debug("InValid UserId");
                res.json({ statusCode: 0, statusMessage: "No User Found" })
            }
            else {
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
                            groupObj = new Object()
                            groupObj.groupId = group._id
                            groupObj.groupName = group.groupName
                            groupObj.description = group.description
                            groupObj.groupImageUrl = group.groupImageUrl
                            groupObj.category = group.category
                            groupObj.hashTag = group.hashTag
                            groupObj.keywords = group.keywords
                            groupObj.createdDateTime = group.createdDateTime

                            groupObj.createdUserId = group.userId._id
                            groupObj.createdUserName = group.userId.fullName
                            groupObj.createdUserProfileImage = group.userId.profileImage
                            var membersCount = 0
                            for (let m = 0; m < group.users.length; m++) {
                                if (group.users[m].status === 2 || group.users[m].status === 1)
                                    membersCount++
                            }
                            groupObj.membersCount = membersCount

                            groupObj.joinStatus = 0
                            for (let j = 0; j < group.users.length; j++) {
                                if (input.userId === String(group.users[j].userId)) {
                                    groupObj.joinStatus = 1
                                }
                            }
                            // groupObj.memberCount = group.users.length;

                            groupsArray.push(groupObj);
                        }
                    }
                    res.json({ statusCode: 1, statusMessage: 'Success', data: groupsArray })
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

router.get('/groups', function (req, res) {
     groupsModel.find({},{"groupName":1}, function (err, groups) {
         if (err) return res.status(500).send("There was a problem finding the groups.");
         res.json({ statusCode: 200, statusMessage: 'Success!!!',data:groups})
          });
 });

module.exports = router