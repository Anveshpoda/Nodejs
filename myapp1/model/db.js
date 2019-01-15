var mongoose = require("mongoose");

mongoose.Promise = global.Promise;

var nameSchema = new mongoose.Schema({
 firstName: String,
 lastName: String
});

var User = mongoose.model("User", nameSchema);
module.exports = User;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/newdb', {
  useNewUrlParser: true
})
.then(() => { console.log('MongoDB connected...')})
.catch(err => console.log(err));


exports.showUser = function (req, res) {
    User.find({}).then(function (results) {
	    res.sendFile(__dirname + "./views/showUser.html" , { 'title':'Results', 'results':results, message:'' });
        //res.render('showUser', { 'title':'Results', 'results':results, message:'' });
    }); 
};