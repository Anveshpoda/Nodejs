var express = require('express');
var router = express.Router();
var User = require('../model/db');
var str = "";

/* GET users listing. */
router.get('/',(req, res, next) => {
   User.find({})
   .then(function (results) {

   var s = f1(results);
   	res.send(s);

    }); 
   
});

	function f1(results,req,res){
		var str = "";
   	 results.forEach( (item) =>{
           if (item.firstName == item.lastName) {

                   str = str + "    Name : " + item.firstName + "</br>";
                   return str;
           }
       });
     return str;
      
	}

module.exports = router;