var express = require('express'),
	router = express.Router(),
	user = require("../models/users");
    //db = require('./db');

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});
router.post('/signup', function(req, res) {
    var information = new user({ 
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        reenterpassword: req.body.reenterpassword,
        age: req.body.age,
        gender: req.body.sex,
        skills: [req.body.Skills],
        stream: req.body.branch,
        contact_number:req.body.contactnumber,
        email: req.body.email,
    });
    if(req.body.password == req.body.reenterpassword){
        information.save(function (err, data) {
            console.log(err, data);
            res.send({'err':err, 'data':data});
        }); 
    } else{
        var html = "<h1>Password enter doesnt matches the reenterpassword<h1>";
        res.send(html);
    }
});
router.post('/login', function(req, res) {
    user.findOne({username: req.body.username, password: req.body.password}, function(err, user) {
        if (err) {
            console.log("err:",err);
        } else {
            if (user) {
                var html = "<h1>Login Successful<h1>"
                res.send(html);
            } else {
                var html = "<h1>Wrong Username or Password<h1>"
                res.send(html);   
            }
        }
    });
});

module.exports = router;
