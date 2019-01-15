let express = require('express')
let mongoose = require('../mongodb/Connections')
let mongoose1 = require('mongoose')
let router = express.Router()
let utils = require('../routes/Utils')
let logger = require('../logger')
let ObjectId = require('mongodb').ObjectID;
let userProfile = require('../mongodb/schemas/UserProfile')
let groupsModel = require('../mongodb/schemas/Groups')

router.get('/', function (req, res) {
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
               
                    groupsModel.find({_id:input.groupId},function (err, groupdata) {
                    if (err) {
                        logger.debug('groupsModel Error');
                        logger.debug(err);
                        res.json({ statusCode: 0, statusMessage: "Error" })
                    } else if (!groupdata) {
                        logger.debug('groupsModel- No Events are not matched for this criteria')
                        res.json({ statusCode: 0, statusMessage: "No FanClubs are not matched for this criteria " })
                    } else {
                        
                        var groupsArray = []
                        var wallArray=[]
                        
                        for (var i = 0; i < groupdata.length; i++) {
                            let groupObj = {}
                            let group = groupdata[i];
                            //eventObj = event.toObject();
                            groupObj = new Object()
                            groupObj.groupId = group._id
                            groupObj.fullName=data.userName
                            groupObj.profileImage=data.profileImage
                            
                            for(var j = 0;j < group.wall.length; j++){
                                let wallObj = {}
                                let wall = group.wall[j];
                                wallObj = new Object()
                                 wallObj.wallId=wall._id
                                 wallObj.userId=wall.userId
                                 wallObj.description=wall.description
                                 wallObj.imageUrl=wall.imageUrl
                                 wallObj.createdDateTime=wall.createdDateTime
                                 
                                  var likes = 0
                            for (let m = 0; m < group.likes.length; m++) {
                                if (group.likes[m].wallId ==wall._id )
                                    likes++
                            }

                            wallObj.likes=likes
                            wallArray.push(wallObj);
                            }
                        }
                        groupsModel.populate(wallArray, {path: "userId"}, function(err,result){
                            if(err)
                                res.send("ERROR")
                            else
                                 res.json({ statusCode: 1, statusMessage: 'Success', data: result })
                        });
                       
                    }
                    
                })
                       
}
})

})



function validateRequest(input, response) {
    if (!utils.isValidObjectID(input.userId)) {
        response.statusCode = 0; response.statusMessage = "invalid userId"
    }
}


function validateRequest(input, response, req) {
    if (!utils.isValidObjectID(input.userId)) {
        response.statusCode = 0; response.statusMessage = "invalid userId"
    } else if (!utils.isValidObjectID(input.groupId)) {
        response.statusCode = 0; response.statusMessage = "invalid groupId"
    }
    // if (!(input.joinStatus == '2' || input.joinStatus == '0' || input.joinStatus=='1')) {
    //     response.statusCode = 0; response.statusMessage = "invalid joinStatus"
    // }
}

module.exports = router