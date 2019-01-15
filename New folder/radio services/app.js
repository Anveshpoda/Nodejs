var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs')
var userLogin = require('./routes/userLogin')
var updateProfile = require('./routes/updateProfile')
var createOrUpdateEvents = require('./routes/createOrUpdateEvents')
// var createOrUpdateGroups = require('./routes/createOrUpdateGroups')
var calenderEvents = require('./routes/calenderEvents')
 var fun2win = require('./routes/questions')
 var search = require('./routes/Search')
var comments = require('./routes/comments')
var storeCreation = require('./routes/storeCreation')
var backgroundImagesList = require('./routes/backgroundImageslist')
// var updateGroups = require('./routes/updateGroups')
// var groupCreation = require('./routes/createOrUpdateGroups')
var group = require('./routes/groupCreation')
var event = require('./routes/eventCreation')
var getGroup=require('./routes/getListOfGroups')
var makeAdmin=require("./routes/makeAsAdmin")
var gfeed=require("./routes/gfeeds")
var feeds=require("./routes/feeds")
var walls=require("./routes/wall")
var ufg=require("./routes/universalfeedget")

// var joinToGroup = require('./routes/jointoGroup')
var joinToGroup = require('./routes/joinOrUnjoinGroup')
var joinToEvent = require('./routes/joinOrUnjoinEvent')
var groupSearch = require('./routes/groupSearch')
// var rsvp = require('./routes/rsvp')
var stories=require("./routes/stories")
var like=require('./routes/likes')
var ufeedshare=require('./routes/ufeedshare')
var gfeedshare=require('./routes/gfeedshare')

var app = express();
var logDirectory = path.join(__dirname, 'log')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'html')
app.engine('html', ejs.renderFile)

const cors = require('cors')
app.use(cors())

const fileUpload = require('express-fileupload')
app.use(fileUpload())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + './views/index.html' );
})


 app.use('/userLogin', userLogin);
 app.use('/updateProfile', updateProfile)
 app.use('/createOrUpdateEvents',createOrUpdateEvents)
 app.use('/getGroups',getGroup)
 // app.use('/createOrUpdateGroups',createOrUpdateGroups)
 // app.use('/calenderEvents', calenderEvents)
 app.use('/eventCreation',event)
 app.use('/backgroundImagesList',backgroundImagesList)
// app.use('/updateGroups',updateGroups)
 // app.use('/groupCreation',groupCreation)
 app.use('/joinToGroup',joinToGroup)
 app.use('/joinToEvent',joinToEvent)
 app.use('/makeAsAdmin',makeAdmin)
 app.use('/groupCreation',group)
 app.use('/calenderEvents', calenderEvents)
 app.use('/groupSearch',groupSearch)
 // app.use('/rsvp',rsvp)
 app.use('/story',stories)
 app.use('/gfeed',gfeed)
 app.use('/feeds',feeds)
 app.use('/like',like)
 app.use('/comments',comments)
 app.use('/storeCreation',storeCreation)
 app.use('/fun2win',fun2win)
 app.use('/search',search)
 app.use('/wall',walls)
 app.use('/ufeed',ufg)
 app.use('/ufeedshare',ufeedshare)
 app.use('/gfeedshare',gfeedshare)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found - ' + req.method + ' - ' + req.originalUrl)
  console.log(req.originalUrl)
  err.status = 404
  next(err)
})

// error handler
// app.use(function (err, req, res, next) {

//   // set locals, only providing error in development
//   res.locals.message = err.message
//   res.locals.error = req.app.get('env') === 'development' ? err : {}
//   notFoundLogger.error(err.stack);

//   // render the error page
//   res.status(err.status || 500)
//   res.render('error')
// })

// process.on('uncaughtException', function (err) {
//   errorLogger.error(err.stack);
// });

module.exports = app
