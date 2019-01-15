var express = require('express')
var mongoose = require('../mongodb/Connections')
var mongoose1 = require('mongoose')
var router = express.Router()
var utils = require('../routes/Utils')
var logger = require('../logger')
var ObjectId = require('mongodb').ObjectID;
var userProfile = require('../mongodb/schemas/UserProfile')
var feedsModel = require('../mongodb/schemas/Feeds')

router.post('/', function (req, res, next) {
  var input = req.body
  logger.debug(' ::: addMembersToGroup ::: ' + 'userId : ' + input.userId + ', groupId : ' + input.groupId)
  var response = { statusCode: 1, statusMessage: "Success" }
  //addMembersValidation(input, response)
  userProfile.findById({ _id: input.userId }, function (err, data) {
    if (err) {
      logger.debug('->userProfileModel Error'); logger.debug(err)
      res.json({ statussCode: 0, statusMessage: "Error" })
    } else if (!data) {
      logger.debug('->InValid UserId'); res.json({ statusCode: 1, statusMessage: "InValid UserId" })
    } else {
                    let postFeed = new feedsModel({})
                    postFeed.userId = input.userId
                    postFeed.description = input.description
                    postFeed.imageUrl=input.imageUrl
                    postFeed.createdDate = utils.dateInUTC()
                      postFeed.save(function (err, data) {
                        if (err) {
                            console.log('->Events save Error');
                            logger.debug(err);
                            res.json({ statusCode: 0, statusMessage: "something went wrong" })
                        } else {
                            res.json({ statusCode: 1, statusMessage: ' Hurrah!! New Feed Created', data: postFeed })
                            logger.debug(':::Feed Created:::');                                                        
                        }
                    })

           }//else
})
})

exports = module.exports = router