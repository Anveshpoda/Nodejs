var express = require('express');
var mongoose = require('../mongodb/Connections');
var router = express.Router();
var logger = require('../logger')
var userProfile = require('../mongodb/schemas/userProfile');
mongoose.promise = global.promise;

router.post('/', function (req, res) {
    var input = req.body;
    console.log(input);
    var response = { statusCode: 1, statusMessage: "success" }
    //userValidation(input, response)
    if (response.statusCode != 0) {
        userProfile.findOne({ userid: input.userid }, function (err, userprofile) {
            if (err) {
                return res.status(500).send("There was a problem adding the information to the database.");
            }
            else if (userprofile) {
                var tempProfile = userprofile.toObject()
                tempProfile.userId = userprofile._id
                delete tempProfile._id
                console.log('Already Registered User');
                userprofile.mobileNumber = input.mobileNumber
                userprofile.firstName = input.firstName
                userprofile.lastName = input.lastName
                userprofile.password = input.password
                userprofile.email =input.email
                userprofile.location = input.location
                userprofile.profileImage = input.profileImage
                userprofile.save().then((user1) => {
                    res.json({ statusCode: 200, statusMessage: 'User Updated', data: user1 })
                })
                .catch((err) => {
                    res.json({ statusCode: 500, statusMessage: err })
                })
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
            res.json({ statusCode: 500, statusMessage: "something went wrong" })
        }else{
       var tempUserProfile = userprofile.toObject()
       tempUserProfile.userId = userdata._id
       delete tempUserProfile._id
        res.json({ statusCode: 200, statusMessage: 'New User', data: tempUserProfile })
    }
    })
}

// // RETURNS ALL THE USERS IN THE DATABASE
router.get('/users', function (req, res) {
    userProfile.find({}, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the users.");
            res.status(200).send(user);
    });
});

router.post('/login', function (req, res) {
    var input = req.body
    console.log(input)
    userProfile.find({userid : input.userid}, (err, user)=> {
        if (err) return res.send("There was a problem finding the users.")
        else if(!user) return  res.json({statusCode: 204, statusMessage: 'User not exist' });
        else if(user[0].password===input.password)
                return  res.json({statusCode: 200, statusMessage: 'success' , data:user })
        else  return  res.json({statusCode: 204, statusMessage: 'username and password not matched' })
       
        
    });
});
module.exports = router;