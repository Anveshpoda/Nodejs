//https://coursework.vschool.io/mongoose-crud/
'use strict'
let express = require('express')
let mongoose = require('../mongodb/Connections')
let mongoose1 = require('mongoose')
let router = express.Router()
let utils = require('../routes/Utils')
let logger = require('../logger')
let ObjectId = require('mongodb').ObjectID;
let userProfile = require('../mongodb/schemas/UserProfile')
let groupsModel = require('../mongodb/schemas/Groups')


router.post('/', function (req, res) {
    let input = req.body;
    let response = { statusCode: 1, StatusMessage: "success" }
    if (input.groupId) {
        //Update
        groupValidation(input, response)
        if (response.statusCode != 0) {
            groupsModel.findById({ _id: input.userId, _id: input.groupId }, function (err, groupData) {
                if (err) {
                        res.json({statusCode:0 ,StatusMessage:Error})
                } 
                else if(groupData) {
                    groupData.groupId = input._id
                    groupData.groupName = input.groupName
                    groupData.imageUrl  = input.imageUrl
                    groupData.hashTag = input.hashTag
                    groupData.description = input.description
                    groupData.updatedDate = utils.dateInUTC()
                    groupData.populate({ path: 'userId', select: 'mobileNumber fullName', $ne: null }, function (err, gdata) {
                        if(gdata){
                            gdata =gdata.toObject()
                            let gdataresponse = {}
                            gdataresponse.groupId = gdata._id
                            gdataresponse.groupName = gdata.groupName
                            gdataresponse.imageUrl = gdata.imageUrl
                            gdataresponse.hashTag = gdata.hashTag
                            gdataresponse.description = gdata.description
                            gdataresponse.inviteMember = gdata.inviteMember
                            gdataresponse.createdUsermobileNumber = gdata.userId.mobileNumber
                            gdataresponse.createdUsername =  gdata.userId.fullName
                            gdataresponse.createdDate = gdata.createdDate.toISOString().replace(/T/,' ').replace(/\..+/,'')
                            gdataresponse.updatedDate = gdata.updatedDate.toISOString().replace(/T/,' ').replace(/\..+/,'')
                            // if(input.userId === String(gdata.userId._id)){
                            //     gdataresponse.
                            // }
                            groupData.save((err,groupData)=>{
                                if(err){
                                    res.json({statuscode:0,statuscode:'Error'})
                                }
                                res.json({statusCode:1,statusMessage:'Updated',data:gdataresponse})
                            })
                        }    
                })
                }
                else{
                    res.json({statusMessage:'GroupData error'})
                }
            })

        } else {
            res.json(response)
        }

    } else {
        //create
        groupValidation(input,response)
        if(response.statusCode != 0){
            userProfile.findById({_id:input.userId},function(err,data){
                if(err){
                    res.json({statusCode:0 ,StatusMessage:Error})
                }else {
                    let reasonId = '593500980b0cbbe593cd722c'
                    let groupDetails = new groupsModel({})
                   // groupDetails.groupId = groupDetails._id
                   groupDetails.groupName = input.groupName
                    groupDetails.groupImageUrl = input.groupImageUrl
                    groupDetails.groupIcon = input.groupIcon
                    groupDetails.hashTag = input.hashTag
                    groupDetails.description = input.description
                    groupDetails.inviteMember = input.inviteMember
                    groupDetails.locationName = input.locationName
                    groupDetails.longitude = input.longitude
                    groupDetails.latitude = input.latitude
                    groupDetails.userId = input.userId
                    groupDetails.createdDate = utils.dateInUTC()

                   const index = input.phoneNumbers.indexOf(data.mobileNumber);
                   if (index !== -1) {
                       input.phoneNumbers.splice(index, 1);
                   }
                   let tempUsers = []
                   let adminUser = {
                       userId: input.userId,
                       mobileNumber: data.mobileNumber,
                       status: 2,
                       type: "admin",
                       createdDate: utils.dateInUTC(),
                       updatedDate: utils.dateInUTC()
                   }
                   tempUsers.push(adminUser)
                   groupDetails.users = tempUsers

                    if (input.phoneNumbers && input.phoneNumbers.length) {
                    userProfile.find({ $or: [{ mobileNumber: { $in: input.phoneNumbers } }] }, function (err, userData) {
                        if (err) {
                            logger.debug('->userProfileModel Error'); logger.debug(err); res.json({ statussCode: 0, statusMessage: "Error" })
                        } else if (!userData) {
                            logger.debug('->userData - No Data');
                        } else {
                            let hasProfileUsers = []

                            for (u = 0; u < userData.length; u++) {
                                let userInfo = userData[u]
                                hasProfileUsers.push(userInfo.mobileNumber)
                                let user = {
                                    userId: userInfo._id,
                                    mobileNumber: userInfo.mobileNumber,
                                    status: 1,
                                    type: "user",
                                    createdDate: utils.dateInUTC(),
                                    updatedDate: utils.dateInUTC()
                                }
                                groupDetails.users.push(user)
                            }
                            let noProfileUsers = input.phoneNumbers.filter(function (val) {
                                return hasProfileUsers.indexOf(val) == -1;
                            });
                            if (noProfileUsers.length) {
                                for (np = 0; np < noProfileUsers.length; np++) {
                                    let noUserNumber = noProfileUsers[np]
                                    let user = {
                                        userId: ObjectId("000000000000000000000000"),
                                        mobileNumber: noUserNumber,
                                        status: 1,
                                        type: "user",
                                        createdDate: utils.dateInUTC(),
                                        updatedDate: utils.dateInUTC()
                                    }
                                    groupDetails.users.push(user)
                                }
                            }
                        }
                    })
                } else {
                    // no members added while fanclub creation 
                    saveGroup(groupDetails, input, req, res)
                }
                saveGroup(groupDetails, input, req, res)
                }
            })
        }else{
            res.json(response)
        }

    }
})

function saveGroup(groupDetails, input, req, res) {
    groupDetails.save(function (err, fanCDetails) {
        if (err) {
            logger.debug('->fanCDetails save Error');
            logger.debug(err);
            res.json({ statussCode: 0, statusMessage: "Error" })
        }
        fanCDetails
            .populate({
                path: 'userId',
                select: 'mobileNumber fullName aboutYou profileImage', $ne: null
            }, function (err, fanCDetails) {
                if (err) {
                    logger.debug('->groupDetails populate Error');
                    logger.debug(err);
                    res.json({ statussCode: 0, statusMessage: "Error" })
                }
                res.json({ statusCode: 1, statusMessage: 'Success', data:fanCDetails })
                //getUsers(groupDetails, input, req, res)
            })
    })
}

function getUsers(groupDetails,input,req,res){
    groupDetails = groupDetails.toObject()
    let groupResponse={}
    groupResponse.groupId = groupDetails._id
    groupResponse.groupName = groupDetails.groupName
    groupResponse.description = groupDetails.description
    groupResponse.imageUrl = groupDetails.imageUrl
    groupResponse.hashTag = groupDetails.hashTag
    groupResponse.locationName = groupDetails.locationName
    groupResponse.latitude = groupDetails.latitude
    groupResponse.longitude = groupDetails.longitude

    res.json({ statusCode: 1, statusMessage: 'Success', data: groupResponse })
}

function groupValidation(response, input, res, Owner) {
    if (response.statusCode != 0) {
        if (utils.isStringBlank(input.name)) {
            response.statusCode = 0; response.statusMessage = "GroupName is Mandatory"
        } else if (input.name.trim().length > 30) {
            response.statusCode = 0; response.statusMessage = "Name filed length should not be greater than 30"
        } else if (utils.isStringBlank(input.description)) {
            response.statusCode = 0; response.statusMessage = "Add Description"
        } else if (utils.isStringBlank(input.latitude)) {
            response.statusCode = 0; response.statusMessage = "latitude is Mandatory"
        } else if (utils.isStringBlank(input.locationName)) {
            response.statusCode = 0; response.statusMessage = "Location name is Mandatory"
        } else if (utils.isStringBlank(input.longitude)) {
            response.statusCode = 0; response.statusMessage = "longitude is Mandatory"
        } else if (input.description.length > 300) {
            response.statusCode = 0; response.statusMessage = "Description filed length should not be greater than 300";
        } else if (utils.isStringBlank(input.hashTag)) {
            response.statusCode = 0; response.statusMessage = "Give Hash Tag"
        } else if (utils.isStringBlank(input.imageUrl)) {
            response.statusCode = 0; response.statusMessage = "Add Image URL"
        } else if (!utils.isValidObjectID(input.userId)) {
            response.statusCode = 0; response.statusMessage = "InValid UserId"
        }
        
    }
}
module.exports = router