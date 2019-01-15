var express = require('express')
var mongoose = require('../mongodb/Connections')
var mongoose1 = require('mongoose')
var router = express.Router()
var utils = require('../routes/Utils')
var ObjectId = require('mongodb').ObjectID;  
var userProfile = require('../mongodb/schemas/UserProfile')
var backgroundImages = require('../mongodb/schemas/BackgroundImages')

router.get('/', function (req, res) {
    backgroundImages.find({} ,function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});
router.post('/background',function(req,res){
   var background={
    backgroundImageUrl:req.body.back
    }
	backgroundImages.create(background,function(err,result){
		if(err){
			res.send(err);
		}
		else{
			res.send("Stored Successfully");
		}

	})
})

module.exports = router