var express = require('express')
var mongoose = require('../mongodb/Connections')
var mongoose1 = require('mongoose')
var router = express.Router()
var utils = require('../routes/Utils')
var ObjectId = require('mongodb').ObjectID;  
var userProfile = require('../mongodb/schemas/UserProfile')
var stories = require('../mongodb/schemas/stories')

router.get('/', function (req, res) {
    stories.find({} ,function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});
router.post('/',function(req,res){
   var story={
    story:req.body.story,
    imageUrl:req.body.imageurl,
    title:req.body.title,
    }
    stories.create(story,function(err,result){
        if(err){
            res.send(err);
        }
        else{
            res.send("Stored Successfully");
        }

    })
})

module.exports = router