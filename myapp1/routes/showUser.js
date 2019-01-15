var express = require('express');
var router = express.Router();
var User = require('../model/db');

/* GET users listing. */
router.get('/',function(req, res, next) {
   User.find({}).then(function (results) {
	    res.render('showUser', { 'title':'Results', 'results':results, message:'' });
    }); 
});

module.exports = router;
