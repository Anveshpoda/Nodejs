var express = require('express');
/*var app = express();
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost' ;
var str = "";
var count = 2;

app.route('/Emp').get( function (req,res)
{  
// Connect to the db
MongoClient.connect(url, function (err, client) {
  if (err) throw err;

  var db = client.db('mydb');

  db.collection('emp').find().each( function (Err, result) {
    if (Err) throw Err; else console.log(result);
	if(result != null){
		str = str + "Name : "+ result.first_name + "</br>";
		console.log(str);
	}
  });
  res.send(str);
});
});
var server = app.listen(3000,function(){});*/



/*var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost';
var str = "";

app.route('/Emp').get(function(req, res) {
   MongoClient.connect(url, function(err, client) {
	   
	   var db = client.db('mydb');
       var cursor = db.collection('emp').find({});
       str = "";
       cursor.forEach(function(item) {
           if (item != null) {
                   str = str + "    Name : " + item.first_name + "</br>";
           }
       }, function(err) {
           res.send(str);
           
          }
       );
   });
});
var server = app.listen(3000, function() {}); */



var Promise = require('bluebird');

var mongoClient = Promise.promisifyAll(require('mongodb')).MongoClient;

var url = 'mongodb://localhost';
mongoClient.connectAsync(url)
	.then(function(client) {
		var db = client.db('mydb');
        return db.collection('emp').findAsync({})
		
    })
    .then(function(cursor) {
        cursor.each(function(err, doc) {
            console.log(doc);
        })
    });
