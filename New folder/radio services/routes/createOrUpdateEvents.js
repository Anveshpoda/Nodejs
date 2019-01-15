var express = require('express')
var mongoose = require('../mongodb/Connections')
var mongoose1 = require('mongoose')
var router = express.Router()
var logger = require('../logger')
var utils = require('../routes/Utils')
var ObjectId = require('mongodb').ObjectID;
var userProfile = require('../mongodb/schemas/UserProfile')
var eventsModel = require('../mongodb/schemas/Events')

// router.get('/events', function (req, res) {
//     eventsModel.find({}, function (err, users) {
//         if (err) return res.status(500).send("There was a problem finding the users.");
//         res.status(200).send(users);
//     }).sort({ eventStartDateTime: 'desc' });
// });

var flag = false
router.post('/', function (req, res) {
    flag = false
    var input = req.body
    var response = { statusCode: 1, statusMessage: "Success" }
  if (input.eventId) {
        eventValidation(input, response)
        if (response.statusCode != 0) {
           // if (input.eventId) {
                eventsModel.findOneAndUpdate({ _id: input.eventId, userId: input.userId }, {
                    $set: {
                        eventDescription: input.eventDescription,
                        eventTitle: input.eventTitle,
                        eventEndDateTime: input.eventEndDateTime,
                        eventStartDateTime: input.eventStartDateTime,
                        eventLocation: input.eventLocation,
                        modifiedDateTime: utils.dateInUTC(),
                        eventImageUrl: input.eventImageUrl,
                        eventLocation : input.eventLocation,
                        latitude: input.latitude,
                        longitude: input.longitude
                    }
                }, function (err, eventdata) {
                    if (err) {
                        logger.debug('->EventsModel Error'); logger.debug(err)
                        res.json({ statusCode: 0, statusMessage: "No eventId  are not matched for this criteria" })
                    } else if (eventdata) {
                         logger.debug('->Event updated')
                        res.json({ statusCode: 0, statusMessage: "Event updated" ,data:{eventdata}})
                    }
                    // })
                    else {
                        // logger.debug('->No userId and EventId are not matched for this criteria');
                        // res.json({ statusCode: 0, statusMessage: "No userId or EventId are not matched for this criteria " }); return
                        res.json(response)
                    }
                })

           // }
        }
        else{
            res.json(response)
        }
    }else {
            // logger.debug(' ::: createEvent ::: ')
            userProfile.findById({ _id: input.userId }, function (err, data) {
                if (err) {
                    console.log('->UserProfileModel Error'); logger.debug(err)
                    res.json({ statussCode: 0, statusMessage: "Error" })
                } else if (!data) {
                    console.log('->InValid UserId'); res.json({ statusCode: 0, statusMessage: "InValid UserId" })
                } else {   /*CreateEvent*/
                    if (response.statusCode != 0) {
                        var reasonId = '593501b80b0cbbe593cd7235'/*Event creation*/
                        var createEvents = new eventsModel({})
                        createEvents.userId = input.userId
                        createEvents.eventTitle = input.eventTitle
                        createEvents.eventDescription = input.eventDescription
                        createEvents.eventDate = input.eventDate
                        createEvents.eventStartDateTime = input.eventStartDateTime
                        createEvents.eventEndDateTime = input.eventEndDateTime
                        createEvents.eventImageUrl = input.eventImageUrl
                        createEvents.eventLocation = input.eventLocation
                        createEvents.latitude = input.latitude
                        createEvents.longitude = input.longitude
                        createEvents.addCalender = input.addCalender
                        createEvents.createdDateTime = utils.dateInUTC()
                        createEvents.modifiedDateTime = utils.dateInUTC()

                        createEvents.save(function (err, data) {
                            if (err) {
                                console.log('->Events save Error');
                                //logger.debug(err)
                                res.json({ statusCode: 0, statusMessage: "something went wrong" })
                            }else{
                                res.json({ statusCode: 1, statusMessage: ' Hurrah!! New Event Created', data: createEvents._id })
                            }
                        })
                    } else {
                        res.json(response)
                    }
                }
            })
        }
});

    function eventValidation(input, response) {
        if (flag)
            if (!utils.isValidObjectID(input.eventId)) {
                response.statusCode = 0; response.statusMessage = "InValid eventId"
            }
        if (!utils.validateDate(input.eventStartDateTime) || !utils.validateDate(input.eventEndDateTime)) {
            console.log("Date Format Error")
            response.statusCode = 0; response.statusMessage = "please provide valid date format(yyyy-mm-dd hh:mm:ss) "
        } else if (utils.compare(input.eventStartDateTime, utils.dateInUTC()) == -1) {
            response.statusCode = 0; response.statusMessage = "start date cannot be less than current date "
        } else if (utils.compare(input.eventEndDateTime, utils.dateInUTC()) == -1) {
            response.statusCode = 0; response.statusMessage = "end date cannot be less than current date "
        } else if (utils.compare(input.eventStartDateTime, input.eventEndDateTime) == 0) {
            response.statusCode = 0; response.statusMessage = "start date & end date cannot be same "
        } else if (utils.compare(input.eventEndDateTime, input.eventStartDateTime) == -1) {
            response.statusCode = 0; response.statusMessage = "end date time  cannot be less than start date "
        } else if (utils.isStringBlank(input.eventDescription)) {
            response.statusCode = 0; response.statusMessage = "Description is Mandatory and Description should be String"
        } else if (input.eventDescription.length > 75) {
            response.statusCode = 0; response.statusMessage = "description length is out of range"
        } else if (utils.isStringBlank(input.eventTitle)) {
            response.statusCode = 0; response.statusMessage = "eventTitle is Mandatory and eventTitle should be String"
        } else if (input.eventTitle.trim().length > 30) {
            response.statusCode = 0; response.statusMessage = "eventTitle filed length should not be greater than 30"
        } else if (utils.isStringBlank(input.eventImageUrl)) {
            response.statusCode = 0; response.statusMessage = "eventImageUrl  is Mandatory"
        } else if (utils.isStringBlank(input.eventLocation)) {
            response.statusCode = 0; response.statusMessage = "eventLocation  should be String"
        }
        else if (!utils.isValidObjectID(input.userId)) {
            response.statusCode = 0; response.statusMessage = "InValid UserId"
        }
    }
 
    module.exports = router






// var express = require('express')
// var mongoose = require('../mongodb/Connections')
// var mongoose1 = require('mongoose')
// var router = express.Router()
// var logger = require('../logger')
// var utils = require('../routes/Utils')
// var ObjectId = require('mongodb').ObjectID;
// var userProfile = require('../mongodb/schemas/UserProfile')
// var eventsModel = require('../mongodb/schemas/Events')

// // router.get('/events', function (req, res) {
// //     eventsModel.find({}, function (err, users) {
// //         if (err) return res.status(500).send("There was a problem finding the users.");
// //         res.status(200).send(users);
// //     }).sort({ eventStartDateTime: 'desc' });
// // });

// //var flag = false
// router.post('/', function (req, res) {
//     //flag = false
//     var input = req.body
//     logger.debug(' ::: createOrUpdateEvent ::: ')
//     var response = { statusCode: 1, statusMessage: "Success" }
//         if (input.eventId) {
//         logger.debug(' ::: UpdateEvent ::: ')
//         /*UpdateEvent*/
//         //flag = true
//         //eventValidation(input, response)
//         if (response.statusCode != 0) {
//            // if (input.eventId) {
//                 // input.eventStartDateTime = input.eventStartDateTime.replace(" ", "T")
//                 // input.eventStartDateTime.concat('.000z')
//                 // input.eventEndDateTime = input.eventEndDateTime.replace(" ", "T")
//                 // input.eventEndDateTime.concat('.000z')

//                 eventsModel.findOneAndUpdate({ _id: input.eventId, userId: input.userId }, {
//                     $set: {
//                         eventDescription: input.eventDescription,
//                         eventTitle: input.eventTitle,
//                         eventEndDateTime: input.eventEndDateTime,
//                         eventStartDateTime: input.eventStartDateTime,
//                         eventLocation: input.eventLocation,
//                         modifiedDateTime: utils.dateInUTC(),
//                         eventImageUrl: input.eventImageUrl,
//                         eventLocation: input.eventLocation,
//                         latitude: input.latitude,
//                         longitude: input.longitude
//                     }
//                 }, function (err, eventdata) {
//                     if (err) {
//                         logger.debug('->EventsModel Error'); logger.debug(err)
//                         res.json({ statusCode: 0, statusMessage: "No eventId  are not matched for this criteria" })
//                     }
//                     // else if (eventdata) {
//                     //     logger.debug('->No Id are not matched for this criteria')
//                     //     res.json({ statusCode: 0, statusMessage: "Event has been updated successfully" ,data:response})
//                     // }
//                     else {
//                         res.json(response)
//                     }
//                 })

// //}
//         }
//         else{
//             res.json(response)
//         }
//     } else {
//         // logger.debug(' ::: createEvent ::: ')
//         userProfile.findById({ _id: input.userId }, function (err, data) {
//             if (err) {
//                 console.log('->UserProfileModel Error'); logger.debug(err)
//                 res.json({ statussCode: 0, statusMessage: "Error" })
//             } else if (!data) {
//                 console.log('->InValid UserId'); res.json({ statusCode: 0, statusMessage: "InValid UserId" })
//             } else { /*CreateEvent*/
//                 if (response.statusCode != 0) {
//                     var reasonId = '593501b80b0cbbe593cd7235'/*Event creation*/
//                     // input.eventStartDateTime = input.eventStartDateTime.replace(" ", "T")
//                     // input.eventStartDateTime.concat('.000z')
//                     // input.eventEndDateTime = input.eventEndDateTime.replace(" ", "T")
//                     // input.eventEndDateTime.concat('.000z')

//                     var createEvents = new eventsModel({})
//                     createEvents.userId = input.userId
//                     createEvents.eventTitle = input.eventTitle
//                     createEvents.eventDescription = input.eventDescription
//                     createEvents.eventDate = input.eventDate
//                     createEvents.eventStartDateTime = input.eventStartDateTime
//                     createEvents.eventEndDateTime = input.eventEndDateTime
//                     createEvents.eventImageUrl = input.eventImageUrl
//                     createEvents.eventLocation = input.eventLocation
//                     createEvents.latitude = input.latitude
//                     createEvents.longitude = input.longitude
//                     createEvents.addCalender = input.addCalender
//                     createEvents.createdDateTime = utils.dateInUTC()
//                     createEvents.modifiedDateTime = utils.dateInUTC()

//                     createEvents.save(function (err, data) {
//                         if (err) {
//                             console.log('->Events save Error');
//                             logger.debug(err)
//                             res.json({ statusCode: 0, statusMessage: "something went wrong" })
//                         }
//                         res.json({ statusCode: 1, statusMessage: ' Hurrah!! New Event Created' })
//                     })
//                 } else {
//                     res.json(response)
//                 }
//             }
//         })
//     }
// });


// function eventValidation(input, response) {
// //if (flag)
//         if (!utils.isValidObjectID(input.eventId)) {
//             response.statusCode = 0; response.statusMessage = "InValid eventId"
//         }
//     if (!utils.validateDate(input.eventStartDateTime) || !utils.validateDate(input.eventEndDateTime)) {
//         response.statusCode = 0; response.statusMessage = "please provide valid date format(yyyy-mm-dd hh:mm:ss) "
//     } else if (utils.compare(input.eventStartDateTime, utils.dateInUTC()) == -1) {
//         response.statusCode = 0; response.statusMessage = "start date cannot be less than current date "
//     } else if (utils.compare(input.eventEndDateTime, utils.dateInUTC()) == -1) {
//         response.statusCode = 0; response.statusMessage = "end date cannot be less than current date "
//     } else if (utils.compare(input.eventStartDateTime, input.eventEndDateTime) == 0) {
//         response.statusCode = 0; response.statusMessage = "start date & end date cannot be same "
//     } else if (utils.compare(input.eventEndDateTime, input.eventStartDateTime) == -1) {
//         response.statusCode = 0; response.statusMessage = "end date time  cannot be less than start date "
//     } else if (utils.isStringBlank(input.eventDescription)) {
//         response.statusCode = 0; response.statusMessage = "Description is Mandatory and Description should be String"
//     } else if (input.eventDescription.length > 75) {
//         response.statusCode = 0; response.statusMessage = "description length is out of range"
//     } else if (utils.isStringBlank(input.eventTitle)) {
//         response.statusCode = 0; response.statusMessage = "eventTitle is Mandatory and eventTitle should be String"
//     } else if (input.eventTitle.trim().length > 30) {
//         response.statusCode = 0; response.statusMessage = "eventTitle filed length should not be greater than 30"
//     } else if (utils.isStringBlank(input.eventImageUrl)) {
//         response.statusCode = 0; response.statusMessage = "eventImageUrl  is Mandatory"
//     } else if (utils.isStringBlank(input.eventLocation)) {
//         response.statusCode = 0; response.statusMessage = "eventLocation  should be String"
//     }
//     else if (!utils.isValidObjectID(input.userId)) {
//         response.statusCode = 0; response.statusMessage = "InValid UserId"
//     }
// }

// module.exports = router




    



