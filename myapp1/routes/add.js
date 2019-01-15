var express = require('express');
var router = express.Router();

/* GET Add page. */

/*router.get('/add', function(req, res, next) {
  res.sendFile(__dirname + "../index.html");
});
*/
router.get('/', function(req, res, next) {
  res.render('index1', { title: 'Express' });
});

module.exports = router;
