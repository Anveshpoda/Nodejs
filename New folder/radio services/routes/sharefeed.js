var express = require('express');
var router = express.Router();
var utils = require('../routes/Utils');
var FanClubs = require('../mongodb/schemas/FanClubs');
var FanClubFeed = require('../mongodb/schemas/FanClubFeed');
var logger = require('../logger');
const serviceAccount = process.env.APP_ENVIRONMENT || 'none'

router.get('/:feedId', function (req, res) {
    var input = req.params;
    logger.debug('share/feed/ ::: ' + 'FeedId :' + input.feedId);
    var response = {
        statusCode: 1
    }
    validateRequest(input, response);
    if (response.statusCode != 0) {
        FanClubFeed.findOne({_id : input.feedId , isDeleted : false, junkFeed : false }, { feedUrl: 1, description: 1, type: 1, thumbnail: 1, fanClubId: 1 }, function (err, feedData) {
            if (err) {
                logger.debug(err)
                res.json({
                    statusCode: 0,
                    statusMessage: err
                })
                return;
            } else if (!feedData) {
                res.json({
                    statusCode: 0,
                    statusMessage: "No packs found"
                })
                return;
            } else {
                shareFeed(feedData, input, req, res);
            }
        });

    } else {
        res.json(response);
    }
});

function shareFeed(feedData, input, req, res) {
    var result = {}
    result.name = ""
    result.description = feedData.description ? feedData.description : ""
    var url;
    if(serviceAccount === 'dev' || serviceAccount === 'none')
        url = "https://dev.fankick.io/share/feed/";
    else if(serviceAccount === 'qa')
        url = "https://qa.fankick.io/share/feed/";
    else if(serviceAccount === 'live')
         url = "https://fankick.io/share/feed/";
    else if(serviceAccount === 'prepod')
         url = "https://prepod.fankick.io/share/feed/";
    if ("video" === feedData.type) {
        result.url = url + input.feedId;
        result.imageURL = feedData.thumbnail ? feedData.thumbnail : ""
        res.render('share', { name: result.name, description: result.description, imageUrl: result.imageURL,url: result.url }, function (err, html) {
            res.send(html)
        });
    } else if ("text" === feedData.type) {
        FanClubs.findOne({_id : feedData.fanClubId,
            $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }]}, { imageUrl: 1 }, function (err, FanClubData) {
            if (err) {
                res.json({
                    statusCode: 0,
                    statusMessage: "ERROR"
                })
            } else if (!FanClubData) {
                res.json({
                    statusCode: 0,
                    statusMessage: "No fanClubs found with given feedId"
                })
            } else {
                  
                 result.url = url + input.feedId;
                result.imageURL = FanClubData.imageUrl ? FanClubData.imageUrl : ""
                res.render('share', { name: result.name, description: result.description, imageUrl: result.imageURL,url: result.url}, function (err, html) {
                    res.send(html)
                });
            }
        })
    } else if ("image" === feedData.type) {
          
            result.url = url + input.feedId;
        result.imageURL = feedData.feedUrl ? feedData.feedUrl : ""
        res.render('share', { name: result.name, description: result.description, imageUrl: result.imageURL, url:result.url }, function (err, html) {
            res.send(html)
        });
    } else {
        res.json({ statusCode: 0, statusMessage: "Invalid feedType" });
    }

}

function validateRequest(input, response) {
    var feedId = input.feedId;

    if (!utils.isValidObjectID(feedId)) {
        response.statusCode = 0;
        response.statusMessage = "invalid feedId"
    }
}

module.exports = router;