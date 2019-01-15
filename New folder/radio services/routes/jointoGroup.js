//https://coursework.vschool.io/mongoose-crud/

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
    let input = req.query;
    let response = { statusCode: 1, StatusMessage: "success" }
    if (response.statusCode != 0) {
        groupsModel.findOne({ _id: input.groupId }, function (err, groupDetails) {
            if (err) {
                res.json({ statusCode: 0, StatusMessage: Error })
            }
            else if (!groupDetails) {
                console.log('No User found'); res.json({ statusCode: 0, statusMessage: "No User found" })
            }
            else if (groupDetails) {
                //eventDetails.mobileNumber = input.mobileNumber
                if (input.userId) {
                    userProfile.find({ _id: input.userId }, function (err, userData) {
                        if (err) {
                            logger.debug('->userProfileModel Error'); logger.debug(err); res.json({ statussCode: 0, statusMessage: "Error" })
                        } else if (!userData) {
                            logger.debug('->userData - No Data');
                        } else {
                            let hasProfileUsers = []
                            let userInfo;
                            for (let u = 0; u < userData.length; u++) {
                                if (hasProfileUsers.indexOf(userData[u]) < 0) {
                                    userInfo = userData[u]
                                    hasProfileUsers.push(userInfo.userId)
                                }
                                let user = {
                                    userId: userInfo._id,
                                    mobileNumber: userInfo.mobileNumber,
                                    status: 1,
                                    type: "user",
                                    createdDate: utils.dateInUTC(),
                                    updatedDate: utils.dateInUTC()
                                }

                                groupDetails.groupusers.addToSet(user)

                                let membersCount = 0
                                for (let m = 0; m < groupDetails.groupusers.length; m++) {
                                    if (groupDetails.groupusers[m].status === 1)
                                        membersCount++
                                }
                                groupDetails.membersCount = membersCount
                            }
                            saveGroup(groupDetails, input, req, res)
                        }
                    })
                }
                else {
                    console.log("error");
                }
            }
        })
    }
    else {
        res.json(response)
    }
})

let saveGroup = function (groupDetails, input, req, res) {
    groupDetails.save(function (err, doc) {
        if (err) {
            res.json({ statusCode: 0, statusMessage: "something went wrong" })
        }
        else {
            let tempUserProfile = groupDetails.toObject()
            tempUserProfile.userId = doc._id
            delete tempUserProfile._id
            // if(groupsModel.find({ poojausers: { $eleMatch: { status:{$eqa:1} } } })){
            // if (groupsModel.find({ groupusers: { $eleMatch: { _id: input.userId } } })) {
            //     res.json({ statusCode: 1, statusMessage: 'User already joined' })
            // } else {
                res.json({ statusCode: 1, statusMessage: 'User joined', data: tempUserProfile })
            }
        // }
        // res.json({ statusCode: 1, statusMessage: 'Updated user', data: tempUserProfile })
        // res.json({ statusCode: 1, statusMessage: 'Testing' })
    })
    // res.json({ statusCode: 1, statusMessage: 'Testing' })
}
router.get('/user', function (req, res) {
    let input = req.query;
    groupsModel.update({_id: 'input.groupId'}, 
    { $pull: { groupusers : { _id:'input.userId'  } } }, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
         res.json(user)
    });
});
// router.get('/user', function (req, res) {
//     let input = req.query;
//     var myquery = { groupusers: input.userId  };
//     var gid={groupId:input.groupId};
//     groupsModel.remove( myquery, function (err, user) {
//         if (err) return res.status(500).send("There was a problem updating the user.");
//          res.json(user)
//     });
// });


// db.schools.find( { zipcode: "63109" },
// { students: { $elemMatch: { school: 102 } } } )
/*router.get('/', function (req, res) {
    let userid = new ObjectId("5a4c810b4698ea0e1cd10404");
groupsModel.aggregate(
    { "$match": { "_id": userid } },
  { "$unwind": "$users" },
  //{ "$match": { "users.mobileNumber":1} },
  {$group: {_id: '$_id', 'sum': { $sum: 1}}},
  //{$match: {'_id': '5a4c810b4698ea0e1cd10404'}},
  function( err, data ) {

    if ( err )
      throw err;
  res.json({ statusCode: 1, statusMessage: 'Updated user', data: data })
    //console.log( JSON.stringify( data, undefined, 2 ) );

  }
);
});*/

module.exports = router