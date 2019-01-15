var express = require('express');
var router = express.Router();
var utils = require('../routes/Utils');
var groupsModel = require('../mongodb/schemas/Groups');
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
        feedsModel.findOne({_id : input.feedId}, function (err, feedData) {
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
    result.description = feedData.feedsDescription ? feedData.feedsDescription : ""
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
        res.render('share', { description: result.description, feedsImageUrl: result.imageURL,url: result.url }, function (err, html) {
            res.send(html)
        });
    } else if ("text" === feedData.type) {
        feedsModel.findOne({_id : feedData._id}, function (err, FeedData) {
            if (err) {
                res.json({
                    statusCode: 0,
                    statusMessage: "ERROR"
                })
            } else if (!FeedData) {
                res.json({
                    statusCode: 0,
                    statusMessage: "No feeds found with given feedId"
                })
            } else {
                  
                 result.url = url + input.feedId;
                 // res.json({statusMessage:"success"})
                result.imageURL = FeedData.feedsImageUrl ? FeedData.feedsImageUrl : ""
                res.json({ description: result.description, feedsImageUrl: result.imageURL,url: result.url})

                
            }
        })
    } else if ("image" === feedData.type) {
          
            result.url = url + input.feedId;
        result.imageURL = feedData.feedUrl ? feedData.feedUrl : ""
        res.render('share', { description: result.description, feedsImageUrl: result.imageURL, url:result.url }, function (err, html) {
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