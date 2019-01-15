'use strict'
let express = require('express');
//let passport = require('passport');
//let promise = require('promise')
let mongoose = require('../mongodb/Connections');
let router = express.Router();
let logger = require('../logger')
let utils = require('../routes/Utils')
mongoose.promise = global.promise;
var requestify = require('requestify')
var Constants = require('../routes/Constants')
let userProfileModel = require('../mongodb/schemas/UserProfile')

router.post('/', function (req, res) {
    var input = req.body
    logger.debug(' ::: userLogin ::: ')
    var response = { statusCode: 1, statusMessage: "success" }
    userValidation(input, response)
    if (response.statusCode != 0) {
        if (input.type === Constants.MOBILE_LOGIN) {
            requestify.get('https://graph.accountkit.com/v1.2/me/?access_token=' + input.mobileNumber, {
            }).then(function (response) {
                if (response.getBody() && response.getBody().application && response.getBody().application.id && (response.getBody().application.id === '1649430318663897' || response.getBody().application.id === '1592699054124367')) {
                    input.mobileNumber = response.getBody().phone.number
                    mobileNumberValidation(input, response)
                    if (response.statusCode != 0) {
                        createOrGetUser(input, res, null)
                    } else {
                        res.json(response)
                    }
                } else {
                    logger.debug('Authentication Failed , Invalid Mobile Number')
                    res.json({ statusCode: 0, statusMessage: "Authentication Failed" })
                }
            }).fail(function (response) {
                logger.debug('Authentication Failed , Invalid Mobile Number')
                res.json({ statusCode: 0, statusMessage: "Authentication Failed" })
            });
        } else if (input.type === Constants.FACEBOOK_LOGIN) {
            requestify.get('https://graph.facebook.com/me?fields=id,name,location,gender,email,picture&access_token=' + input.token, {
            }).then(function (response) {
                var name = "", picture = "", email = "";
                if (response.getBody()) {
                    if (response.getBody().picture && response.getBody().picture.data && response.getBody().picture.data.url)
                        picture = response.getBody().picture.data.url
                    if (response.getBody().name)
                        name = response.getBody().name
                    if (response.getBody().email)
                        email = response.getBody().email
                }

                if (response.getBody().id && response.getBody().id === input.mobileNumber) {
                    var userSocialInfo = {
                        name,
                        picture,
                        email
                    }
                    createOrGetUser(input, res, userSocialInfo)
                } else {
                    res.json({ statusCode: 0, statusMessage: "Authentication Failed, InValid FacebookId" })
                }
            }).fail(function (response) {
                logger.debug('Authentication Failed , Invalid Facebook token')
                res.json({ statusCode: 0, statusMessage: "Authentication Failed" })
            });
        } else {
            res.json({ statusCode: 0, statusMessage: "Invalid type" })
            return;
        }
    } else {
        res.send(response);
    }

})

var saveUser = function (input, userprofile, res) {
    userprofile.type = input.type
    userprofile.save(function (err, userdata) {
        if (err) { logger.debug('userprofile save Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "something went wrong" }) }
        var tempUserProfile = userprofile.toObject()
        tempUserProfile.userId = userdata._id
        tempUserProfile.profileImagePath = tempUserProfile.profileImage ? tempUserProfile.profileImage : ""
        //tempUserProfile.referenceCode = userdata.referenceCode
        //tempUserProfile.referrelCode = userdata.referrelCode
        delete tempUserProfile._id
        delete tempUserProfile.profileImage
        delete tempUserProfile.createdDateTime
        res.json({ statusCode: 1, statusMessage: 'New User', data: tempUserProfile })
    })
}

function createOrGetUser(input, res, socialMediaData) {
    userProfileModel.findOne({ mobileNumber: input.mobileNumber }, function (err, userprofile) {
        if (err) {
            logger.debug('userProfileModel Error');
            logger.debug(err);
            res.json({ statusCode: 0, statusMessage: "ERROR" })
        } else if (userprofile) {
            getUserInfo(userprofile, input, res)
        } else {
            createNewUser(input, res, socialMediaData)
        }
    })
}

function getUserInfo(userprofile, input, res) {
    userprofile.type = input.type
    // userprofile.save(function (err, uData) {
    //     if (err) {
    //         logger.debug('Error in UserProfile while saving appId')
    //         logger.error(err)
    //     }
    // })
    var tempUserProfile = userprofile.toObject()
    tempUserProfile.userId = userprofile._id
    tempUserProfile.type = input.type
    tempUserProfile.profileImagePath = userprofile.profileImage
    delete tempUserProfile.profileImage
    delete tempUserProfile._id
    logger.debug('Already Registered User');
    res.json({ statusCode: 1, statusMessage: 'Already Registered User', data: tempUserProfile })
}

function createNewUser(input, res, socialMediaData) {
    var userprofile1 = new userProfileModel();
    userprofile1.mobileNumber = input.mobileNumber
    userprofile1.username = socialMediaData ? socialMediaData.name ? socialMediaData.name : "" : ""
    userprofile1.email = socialMediaData ? socialMediaData.email ? socialMediaData.email : "" : ""
    //userprofile1.location = socialMediaData ? socialMediaData.location ? socialMediaData.location.name ? socialMediaData.location.name : "" : "" : ""
    //userprofile1.aboutYou = socialMediaData ? "Awesome!!" : ""
    userprofile1.profileImage = socialMediaData ? socialMediaData.picture ? socialMediaData.picture : "" : ""
    userprofile1.createdDateTime = utils.dateInUTC()
    saveUser(input, userprofile1, res)
}

function userValidation(input, response) {
    if (utils.isStringBlank(input.type)) {
        response.statusCode = 0; response.statusMessage = "type is Mandatory"
    } else if (!utils.isStringBlank(input.type) && (input.type != Constants.MOBILE_LOGIN && input.type != Constants.FACEBOOK_LOGIN)) {
        response.statusCode = 0; response.statusMessage = "InValid value for type"
    }
    if (input.type === Constants.FACEBOOK_LOGIN && utils.isStringBlank(input.token)) {
        response.statusCode = 0; response.statusMessage = "token is Mandatory"
    }
}

function mobileNumberValidation(input, response) {
    if (utils.isStringBlank(input.mobileNumber)) {
        response.statusCode = 0; response.statusMessage = "mobileNumber is Mandatory"
    } else if (!utils.isMobileNumber(input.mobileNumber)) {
        response.statusCode = 0; response.statusMessage = "Provided phone number is invalid."
    }
}
module.exports = router;