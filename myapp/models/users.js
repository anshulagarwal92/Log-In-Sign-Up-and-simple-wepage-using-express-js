var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    "name":String,
    "username":String,
    "password":String,
    "reenterpassword":String,
    "age":{ type: Number, min: 18, max: 70 },
    "gender":{type: String, possibleValues: ['Male','Female']},
    "skills":[String],
    "stream":String,
    "contact_number":{type: String},
    "email":String,
    "img": String,
    "dashimg":[],
});
var user = mongoose.model('User', User);
module.exports = user;
