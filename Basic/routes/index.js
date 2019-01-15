var express = require('express');
var router = express.Router();
var mongoose = require('../mongodb/Connections');
mongoose.promise = global.promise;

var userProfile = require('../mongodb/schemas/userProfile');

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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
