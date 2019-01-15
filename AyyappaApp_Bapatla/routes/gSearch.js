'use strict'
let express = require('express')
let mongoose = require('../mongodb/Connections')
let mongoose1 = require('mongoose')
let router = express.Router()
let utils = require('../routes/Utils')
let logger = require('../logger')
let ObjectId = require('mongodb').ObjectID;
//let userProfile = require('../mongodb/schemas/UserProfile')
let groupsModel = require('../mongodb/schemas/Groups')

router.get('/',function(req,res){
    let input = req.query
    logger.debug('gSearch :::'+input.search)
    let response = { statusCode: 1, StatusMessage: "success" }
    if(response.statusCode != 0){
        groupsModel.find({groupName:{$regex: input.search,'$options':'i'}}).select('_id groupName').exec(function(err,searchData){
            if (err) {
                logger.debug('->groupModel Error'); logger.debug(err)
                res.json({ statusCode: 0, statusMessage: "Error" })
            } else if (!searchData) {
                logger.debug('->groupsModel - No data Found'); res.json({ statusCode: 1, statusMessage: "No data Found" })
            } else {
                let searchListArr =[]
                for(let i=0;i<searchData.length;i++){
                    let searchDataObj = searchData[i]
                    let searchObj = new Object()
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