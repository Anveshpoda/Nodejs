var express = require('express');
var router = express.Router();
var mongoose = require('../mongodb/Connections');
mongoose.promise = global.promise;
var ObjectId = require('mongodb').ObjectID;

var cart = require('../mongodb/schemas/cart');

router.get('/menu', (req, res) =>
    cart.find({}, (err, data) => {
        if (err) return res.status(500).send("There was a problem finding the Items.");
        else res.json({ statusCode: 200, statusMessage: 'success', data: data })
    })
);

router.post('/order', (req, res) => {
    var input = req.body
    const qtyerr = input.items.filter((qt) => (qt.quantity < 1 || qt.quantity > 1000))
    if (qtyerr.length == 0) {
        cart.find({ _id: { $in: input.items.map((id) => ObjectId(id.itemId)) } },
            (err, data) => {
                if (err) return res.json({ statusCode: 500, statusMessage: "There was a problem finding this Order", error: err })
                else if (!data) return res.json({ statusCode: 204, statusMessage: 'Items not exist' });
                else {
                    let orderData = [], totalCost = 0
                    data.map((i) => {
                        let item = i.toObject()
                        input.items.filter((id) => {
                            if (String(id.itemId) === String(item._id)) {
                                item.quantity = id.quantity;
                                item.totalItemCoat = item.cost * parseInt(id.quantity)
                                totalCost += item.totalItemCoat
                                return
                            }
                        })
                        orderData.push(item)
                    })
                    res.json({ statusCode: 200, statusMessage: 'success', totalCost: totalCost, orderData: orderData })
                }
            });
    } else res.json({ statusCode: 500, statusMessage: 'Quantity should be greater than 0 and less than 1000' })
});

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

module.exports = router;
