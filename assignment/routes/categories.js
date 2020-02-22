var express = require('express');
var router = express.Router();
var mongoose = require('../mongodb/Connections');
mongoose.promise = global.promise;
var ObjectId = require('mongodb').ObjectID;

var CategoriesModel = require('../mongodb/schemas/category');

router.get('/getCategories', (req, res) =>
    CategoriesModel.aggregate([{
        $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: 'categoryId',
            as: 'products'
        }
    }, {
        $project: {
            category: 1,
            products: 1,
            productsLength: { $size: "$products" }
        }
    }]).exec((err, data) => {
        if (err) return res.status(500).send("There was a problem finding the Items.");
        else res.json({ statusCode: 200, statusMessage: 'success', data: data })
    })
);

module.exports = router;
