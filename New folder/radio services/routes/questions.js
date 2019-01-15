let express = require('express')
let mongoose = require('../mongodb/Connections')
let mongoose1 = require('mongoose')
let router = express.Router()
let utils = require('../routes/Utils')
let logger = require('../logger')
let ObjectId = require('mongodb').ObjectID;
let userProfile = require('../mongodb/schemas/UserProfile')
let groupsModel = require('../mongodb/schemas/Groups')
var questionsModel = require('../mongodb/schemas/Questions')


router.get('/', function (req, res) {
    var input = req.query
    // logger.debug('::: likeorUnlikeForEvent ::: ' + 'userId : ' + input.userId + ', groupId : ' + input.groupId );
    var response = { statusCode: 2 }
    validateRequest(input, response)
    userProfile.findById({_id: input.userId }, function (err, data) {
        if (err) {
            logger.debug('userProfile Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "Bad Request", data: null })
        } else if (!data) {
            logger.debug("InValid UserId"); res.json({ statusCode: 3, statusMessage: "Bad Request", data: null })
        } else {
        questionsModel.find({},function (err, questions) {
        if (err) return res.status(500).send("There was a problem finding the users.");                    
                      
                       
                        else{
                               
                                res.json({ statusCode: 1, statusMessage: "Success", data: questions })

                            }
                        })
                                                  
        
        }
    })
})
router.post('/', function (req, res) {
    var input = req.body
    // logger.debug('::: likeorUnlikeForEvent ::: ' + 'userId : ' + input.userId + ', groupId : ' + input.groupId );
    var response = { statusCode: 2 }
    validateRequest(input, response)
    userProfile.findById({_id: input.userId }, function (err, data) {
        if (err) {
            logger.debug('userProfile Error'); logger.debug(err); res.json({ statusCode: 0, statusMessage: "Bad Request", data: null })
        } else if (!data) {
            logger.debug("InValid UserId"); res.json({ statusCode: 3, statusMessage: "Bad Request", data: null })
        } else {
            if (response.statusCode != 0) {                                
                        
                      var Questions={
                             title:input.title,
                             description:input.description,
                             imageurl:input.imageurl,     
                             questions:input.question,
                            options:input.options
                            }
                         questionsModel.create(Questions,function(err,result){
                        if(err){
                            res.send(err);
                         }
                        else{
                                var responceObj = {}
                                responceObj.userName=data.fullName
                                responceObj.profileImage=data.profileImage
                                responceObj.userId = input.userId
                                responceObj.descripton=input.description
                                responceObj.imageUrl=input.imageUrl
                                responceObj.questions=input.question
                                responceObj.options=input.options
                                res.json({ statusCode: 1, statusMessage: "Success", data: responceObj })

                            }
                        })                                  
            }
             else {
                res.json(response)
            }
        }
    })
})
function validateRequest(input, response, req) {
    if (!utils.isValidObjectID(input.userId)) {
        response.statusCode = 0; response.statusMessage = "invalid userId"
    } 
    // if (!(input.joinStatus == '2' || input.joinStatus == '0' || input.joinStatus=='1')) {
    //     response.statusCode = 0; response.statusMessage = "invalid joinStatus"
    // }
}

module.exports = router