var express = require('express');
var mongoose = require('../mongodb/Connections');
var router = express.Router();
var logger = require('../logger')
var userProfile = require('../mongodb/schemas/userProfile');
mongoose.promise = global.promise;
console.log("input");

router.post('/', function (req, res) {
    var input = req.body;
    console.log("input");
    console.log(input);
    var response = { statusCode: 1, statusMessage: "success" }
    //userValidation(input, response)
    if (response.statusCode != 0) {
        userProfile.findOne({ firstname: input.firstName }, function (err, userprofile) {
            if (err) {
                return res.status(500).send("There was a problem adding the information to the database.");
            }
            else if (userprofile) {
                var tempProfile = userprofile.toObject()
                tempProfile.userId = userprofile._id
                delete tempProfile._id
                console.log('Already Registered User');
                res.json({ statusCode: 1, statusMessage: 'Already Registered User', data: tempProfile })
            }
             else {
                var user = new userProfile({})
                user.mobileNumber = input.mobileNumber
                user.firstName = input.firstName
                user.lastName = input.lastName
                user.password = input.password
                user.userid = input.userid
                user.email =input.email
                user.location = input.location
                user.profileImage = input.profileImage
                user.createdDateTime = dateInUTC()
                saveUser(user, res);
            }
        });
    }else{
        res.send(response)
    }
});

dateInUTC = function () {
    var now = new Date();
    var now_utc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    return now_utc;
}


var saveUser = function (userprofile, res) {
    userprofile.save(function (err, userdata) {
        if (err) {
            logger.debug('userprofile save Error');
            res.json({ statusCode: 0, statusMessage: "something went wrong" })
        }else{
       var tempUserProfile = userprofile.toObject()
       tempUserProfile.userId = userdata._id
       delete tempUserProfile._id
        res.json({ statusCode: 1, statusMessage: 'New User', data: tempUserProfile })
    }
    })
}

// // RETURNS ALL THE USERS IN THE DATABASE
router.get('/users', function (req, res) {
    userProfile.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});

module.exports = router;