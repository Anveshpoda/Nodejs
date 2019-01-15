var express = require('express');
var router = express.Router();
var User = require('../model/db');

/* GET users listing. */

router.post('/',(req, res) => {
	console.log("hi");
   var myData = new User(req.body);
 myData.save()
 .then(item => {
 res.send("item saved to database");
/* User.find({}).then(function (results) {	
 	
        res.render('showUser', { 'title':'Results', 'results':results, message:'' });
   */ 
 })
 .catch(err => {
 res.status(400).send("unable to save to database");
 });
});

module.exports = router;