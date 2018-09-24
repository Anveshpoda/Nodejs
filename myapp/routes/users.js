var express = require('express');
var router = express.Router();
var userProfile = require('../mongodb/schemas/userProfile');

/* GET users listing. */
router.get('/', function(req, res, next) {
  userProfile.find({}, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the users.");
    res.status(200).send(user);
    //res.status(200).send(user);
});
  //res.send('respond with a resource');
});

module.exports = router;
