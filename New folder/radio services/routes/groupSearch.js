var express = require('express')
var mongoose = require('../mongodb/Connections')
var mongoose1 = require('mongoose')
var router = express.Router()
var utils = require('../routes/Utils')
var logger = require('../logger')
var ObjectId = require('mongodb').ObjectID;
//var userProfile = require('../mongodb/schemas/UserProfile')
var groupsModel = require('../mongodb/schemas/Groups')

router.get('/',function(req,res){
    var input = req.query
    logger.debug('groupSearch :::'+input.search)
    var response = { statusCode: 1, StatusMessage: "success" }
    if(response.statusCode != 0){
        groupsModel.find({groupName:{$regex: input.search,'$options':'i'}}).select('_id groupName').exec(function(err,searchData){
            if (err) {
                logger.debug(' Error'); logger.debug(err)
                res.json({ statusCode: 0, statusMessage: "Error" })
            } else if (!searchData) {
                logger.debug('No data Found'); res.json({ statusCode: 1, statusMessage: "No data Found" })
            } else {
                var searchListArr =[]
                for(i=0;i<searchData.length;i++){
                    searchDataObj = searchData[i]
                    var searchObj = new Object()
                    searchObj.id = searchDataObj._id
                    searchObj.groupName = searchDataObj.groupName
                    searchListArr.push(searchObj)
                }
                res.json({statusCode:0,statusMessage:"Success",data:searchListArr})
            }
        })

    }else{
        res.json(response)
    }
})
module.exports = router;