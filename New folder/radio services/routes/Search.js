var express = require('express')
var mongoose = require('../mongodb/Connections')
var mongoose1 = require('mongoose')
var router = express.Router()
var utils = require('../routes/Utils')
var logger = require('../logger')
var ObjectId = require('mongodb').ObjectID;
//var userProfile = require('../mongodb/schemas/UserProfile')  
var groupsModel = require('../mongodb/schemas/Groups')
var eventsModel = require('../mongodb/schemas/Events')
var storesModel = require('../mongodb/schemas/store')

router.get('/events',function(req,res){
    var input = req.query
    logger.debug('gSearch :::'+input.search)
    var response = { statusCode: 1, StatusMessage: "success" }
    if(response.statusCode != 0){
        eventsModel.find({ "$or": [
    { "eventLocation": { $regex: input.search,'$options':'i'} }, 
    { "eventTitle": { $regex: input.search,'$options':'i'}}
]}).exec(function(err,searchData){
            if (err) {
                logger.debug('->fanClubsModel Error'); logger.debug(err)
                res.json({ statusCode: 0, statusMessage: "Error" })
            } else if (!searchData) {
                logger.debug('->fanClubsModel - No data Found'); res.json({ statusCode: 1, statusMessage: "No data Found" })
            } else {
                var searchListArr =[]
                for(i=0;i<searchData.length;i++){
                    searchDataObj = searchData[i]
                    var searchObj = new Object()
                    searchObj.id = searchDataObj._id
                    searchObj.createdDateTime = searchDataObj.createdDateTime
                    searchObj.modifiedDateTime = searchDataObj.modifiedDateTime
                    searchObj.eventTitle = searchDataObj.eventTitle
                    searchObj.eventLocation = searchDataObj.eventLocation
                    searchObj.eventImageUrl = searchDataObj.eventImageUrl
                    searchObj.eventStartDateTime = searchDataObj.eventStartDateTime
                    searchObj.eventDescription = searchDataObj.eventDescription
                    searchObj.geo = searchDataObj.geo
                    searchObj.users = searchDataObj.users
                    

                    searchListArr.push(searchObj)
                }
                res.json({statusCode:1,statusMessage:"Success",data:searchListArr})
            }
        })

    }else{
        res.json(response)
    }
})




router.get('/groups',function(req,res){
    var input = req.query
    logger.debug('gSearch :::'+input.search)
    var response = { statusCode: 1, StatusMessage: "success" }
    if(response.statusCode != 0){
        groupsModel.find({ "$or": [
    { "location": { $regex: input.search,'$options':'i'} }, 
    { "groupName": { $regex: input.search,'$options':'i'}}
]}).exec(function(err,searchData){
            if (err) {
                logger.debug('->fanClubsModel Error'); logger.debug(err)
                res.json({ statusCode: 0, statusMessage: "Error" })
            } else if (!searchData) {
                logger.debug('->fanClubsModel - No data Found'); res.json({ statusCode: 1, statusMessage: "No data Found" })
            } else {
                var searchListArr =[]
                for(i=0;i<searchData.length;i++){
                    searchDataObj = searchData[i]
                    var searchObj = new Object()
                    searchObj.id = searchDataObj._id
                    searchObj.groupName = searchDataObj.groupName
                    searchObj.location = searchDataObj.location
                    searchObj.users = searchDataObj.users
                    searchListArr.push(searchObj)
                }
                res.json({statusCode:1,statusMessage:"Success",data:searchListArr})
            }
        })

    }else{
        res.json(response)
    }
})



router.get('/stores',function(req,res){
    var input = req.query
    logger.debug('gSearch :::'+input.search)
    var response = { statusCode: 1, StatusMessage: "success" }
    if(response.statusCode != 0){
        storesModel.find({ "$or": [
    { "storeLocation": { $regex: input.search,'$options':'i'} }, 
    { "storeName": { $regex: input.search,'$options':'i'}}
]}).exec(function(err,searchData){
            if (err) {
                logger.debug('->fanClubsModel Error'); logger.debug(err)
                res.json({ statusCode: 0, statusMessage: "Error" })
            } else if (!searchData) {
                logger.debug('->fanClubsModel - No data Found'); res.json({ statusCode: 1, statusMessage: "No data Found" })
            } else {
                var searchListArr =[]
                for(i=0;i<searchData.length;i++){
                    searchDataObj = searchData[i]
                    var searchObj = new Object()
                    searchObj.id = searchDataObj._id
                    searchObj.storeName = searchDataObj.storeName
                    searchObj.storeLocation = searchDataObj.storeLocation
                    searchObj.mobileNumber=searchObj.mobileNumber
                    searchObj.imageUrl=searchObj.imageUrl
                    searchObj.description=searchObj.description
                    searchObj.geo=searchObj.geo
                    searchObj.email=searchObj.email
                    searchObj.website=searchObj.website
                    searchObj.users = searchDataObj.users
                    searchListArr.push(searchObj)
                }
                res.json({statusCode:1,statusMessage:"Success",data:searchListArr})
            }
        })

    }else{
        res.json(response)
    }
})




// router.get('/picker',function(req,res){
//     var input = req.query
//     logger.debug('gSearch :::'+input.search)
//     var response = { statusCode: 1, StatusMessage: "success" }
//     if(response.statusCode != 0){
//         eventsModel.find({$where: function() {return "munta vari center,chirala,prakasam district,andhrapradesh".indexOf(this.eventLocation)> -1; }}).exec(function(err,searchData){
//             if (err) {
//                 logger.debug('->fanClubsModel Error'); logger.debug(err)
//                 res.json({ statusCode: 0, statusMessage: "Error" })
//             } else if (!searchData) {
//                 logger.debug('->fanClubsModel - No data Found'); res.json({ statusCode: 1, statusMessage: "No data Found" })
//             } else {
//                 var searchListArr =[]
//                 for(i=0;i<searchData.length;i++){
//                     searchDataObj = searchData[i]
//                     var searchObj = new Object()
//                     searchObj.id = searchDataObj._id
//                     searchObj.eventLocation = searchDataObj.eventLocation
//                     searchListArr.push(searchObj)
//                 }
//                 res.json({statusCode:0,statusMessage:"Success",data:searchListArr})
//             }
//         })

//     }else{
//         res.json(response)
//     }
// })
module.exports = router;


// router.get('/',function(req,res){
//     var input = req.query
//     logger.debug('gSearch :::'+input.search)
//     var response = { statusCode: 1, StatusMessage: "success" }
//     if(response.statusCode != 0){
//         groupsModel.find({groupName:{$regex: input.search,'$options':'i'}}).select('_id groupName').exec(function(err,searchData){
//             if (err) {
//                 logger.debug('->fanClubsModel Error'); logger.debug(err)
//                 res.json({ statusCode: 0, statusMessage: "Error" })
//             } else if (!searchData) {
//                 logger.debug('->fanClubsModel - No data Found'); res.json({ statusCode: 1, statusMessage: "No data Found" })
//             } else {
//                 var searchListArr =[]
//                 for(i=0;i<searchData.length;i++){
//                     searchDataObj = searchData[i]
//                     var searchObj = new Object()
//                     searchObj.id = searchDataObj._id
//                     searchObj.groupName = searchDataObj.groupName
//                     searchListArr.push(searchObj)
//                 }
//                 res.json({statusCode:0,statusMessage:"Success",data:searchListArr})
//             }
//         })

//     }else{
//         res.json(response)
//     }
// })
// module.exports = router;


// /**
// * @author hmaram@GCS
// */
// var express = require('express')
// var router = express.Router()
// var logger = require('../logger')
// var fanClubsModel = require('../mongodb/schemas/FanClubs')

// router.get('/', function (req, res) {
//     var input = req.query
//     logger.debug('fcSearch :::' + 'search : ' + input.search)
//     var response = { statusCode: 1, statusMessage: "Success" }
//     if (response.statusCode != 0) {
//         fanClubsModel.find({ name: { $regex: input.search, '$options': 'i' } }).select('_id name').exec(function (err, searchData) {
//             /*======Searching the Related data from Fanclubs Collection=======*/
//             if (err) {
//                 logger.debug('->fanClubsModel Error'); logger.debug(err)
//                 res.json({ statusCode: 0, statusMessage: "Error" })
//             } else if (!searchData) {
//                 logger.debug('->fanClubsModel - No data Found'); res.json({ statusCode: 1, statusMessage: "No data Found" })
//             } else {
//                 var searchListArr = []
//                 for (var i = 0; i < searchData.length; i++) {
//                     searchDataObj = searchData[i]
//                     var searchObj = new Object()
//                     searchObj.id = searchDataObj._id
//                     searchObj.name = searchDataObj.name
//                     searchListArr.push(searchObj)
//                 }
//                 res.json({ statusCode: 1, statusMessage: "Success", data: searchListArr })
//             }
//         })
//     } else {
//         res.json(response)
//     }
// })

// exports = module.exports = router