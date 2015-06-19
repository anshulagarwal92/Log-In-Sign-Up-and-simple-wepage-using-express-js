var user = require("../models/users");
var UserController = function() {
    //Todo: Its a constructor
};

UserController.prototype = {
    indexPage: function(req, res, next) {
        res.render('index', { title: 'Express' });
    },
    signup: function(req, res, next) {
        res.render('signup', { title: 'signup' });
    },
    login: function(req, res, next) {
        res.render('login', { title: 'signup' });
    },
    signupPost: function(req, res, next) {
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
            img : "defaultuserimage.jpg",
            dashimg:["defaultuserimage.jpg"],
        });
        information.save(function (err, data) {
            console.log(err, data);
            res.redirect('login');
        });
        console.log(req.body.username)
        mkdirp('./public/uploads/'+req.body.username, function (err) {
            if (err){
                console.log(err);
            } else {
                console.log('pow!');  
            }
        }); 
    },
    loginPost: function(req, res, next) {
        user.findOne({ username: req.body.username, password: req.body.password }, function(err, user) {
            if (err) {
                console.log("err:",err);
            } else {
                if (user) {
                    //session create after login with username
                    req.session.username = req.body.username;
                    console.log('Session created for username:',req.session.username);
                    res.redirect('profile');
                } else {
                    res.redirect('/');   
                }
            }
        });
    },
    profile: function(req, res, next) {
        if(typeof req.session.username !== "undefined") {
            user.findOne({ username: req.session.username}, function(err, users) {
                console.log(err, users);
                if(users) {
                    res.render('profile', {
                        username: req.session.username,
                        img: "/uploads/"+users.img,
                        dashimg:"/uploads/"+users.dashimg,
                        name: users.name,
                        password: users.password,
                        reenterpassword: users.reenterpassword,
                        age: users.age,
                        sex: users.gender,
                        contactnumber: users.contact_number,
                        email: users.email
                    });  
                }
            }); 
        } else {
            res.redirect('login');
        }
    },
    logout: function(req, res, next) {
        //session destroy after logout 
        req.session.destroy(function(err){
            if(err){
                console.log(err);
            } else {
                res.redirect('/');
            }
        });
    },
    uploadPhoto: function(req,res,next){
        //updating image in database
        user.update({ username:req.session.username }, { $set: { img: req.files.image.name }}, function(err, user) {
            if (err || !user){
                throw err;
            } else {
                if(typeof req.files.image.path !== "undefined") {
                    res.redirect('profile');  
                } 
            }
        }); 
    },

    editprofile: function(req,res,next){
        user.update({ username:req.session.username }, { $set: { 
            username: req.body.username,
            name: req.body.name,
            password: req.body.password,
            reenterpassword: req.body.reenterpassword,
            age: req.body.age,
            contact_number: req.body.contactnumber,
            email: req.body.email 
        }}, function(err, user) {
            if (err || !user){
                throw err;
            } else {
                res.redirect('profile');  
            }
        }); 
    },
    dashBoard: function(req,res,next){
        res.render('dashboard', { title: 'dashboard' });
    },
    // dashBoardUpload: function(req,res,next){
    //   if(typeof req.session.username !== "undefined") {
    //         user.findOne({ username: req.session.username}, function(err, users) {
    //             console.log(err, users);
    //             if(users) {
    //                 res.render('dashboard', {
    //                     dashimg:["/uploads/"+users.dashimg],
    //                 });  
    //             }
    //         }); 
    //     } else {
    //         res.redirect('login');
    //     } 
    // }
};
module.exports = UserController;