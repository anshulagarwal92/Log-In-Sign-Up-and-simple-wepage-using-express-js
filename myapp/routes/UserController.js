var user = require("../models/users"),
    multer  = require('multer');
var likeCount = 0;
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
            dashimg: [],
            comment:[],
        });
        information.save(function (err, data) {
            console.log(err, data);
            res.redirect('login');
        });
        // mkdirp('./public/uploads/dashboard_images/'+req.body.username, function (err) {
        //     if (err){
        //         console.log(err);
        //     } else {
        //         console.log('pow!');  
        //     }
        // }); 
    },

    loginPost: function(req, res, next) {
        user.findOne({ username: req.body.username, password: req.body.password }, function(err, user) {
            if (err) {
                console.log("err:",err);
            } else {
                if (user) {
                    //session create after login with username
                    req.session.username = req.body.username;
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
                if(users) {
                    var skills = String(users.skills).split(",");
                    res.render('profile', {
                        username: req.session.username,
                        img: "/uploads/profile_pictures/"+users.img,
                        //dashimg:"/uploads/dashboard_images/"+users.dashimg,
                        name: users.name,
                        password: users.password,
                        reenterpassword: users.reenterpassword,
                        age: users.age,
                        sex: users.gender,
                        contactnumber: users.contact_number,
                        email: users.email,
                        stream: users.stream,
                        skills: skills
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
            email: req.body.email,
            gender: req.body.sex,
            skills: [req.body.Skills],
            stream: req.body.branch, 
        }}, function(err, user) {
            if (err || !user){
                throw err;
            } else {
                res.redirect('profile');  
            }
        }); 
    },
    //gets all dashboard images in an array for all users
    getAllImages: function(req, res, next) {
        user.find({}, function(err, users) {
            if(!err && users) {
                var allImages = [];
                //Iterate all images of all users
                for(var count in users) {
                    allImages = allImages.concat(users[count].dashimg);
                }
                req.allImages = allImages;
                next();
            } else {
                req.allImages = [];
                next();
            }
        });
    },
    dashBoard: function(req,res,next) {
        user.findOne({ username: req.session.username}, function(err, users) {
            if(users) {
                res.render('dashboard', {
                    img:users.img,
                    username:req.session.username,
                    allImages: users.dashimg,
                    allUsersImages: req.allImages,
                    likeCount: "1",
                });  
            } else {
                res.redirect('login');
            }
        });   
    },

    dashBoardUpload: function(req,res,next){
        user.update({ username:req.session.username }, { $push: { dashimg: req.files.image.name } }, function(err, user) {
            if (err || !user){
                throw err;
            } else {
                res.redirect('dashboard');  
            }
        }); 
    },
    // comment:function(req,res,next){
    //     console.log("hello i am in comment");
    //     user.update({username:req.session.username},{$push:{comment:req.body.comment}},function(err,users){
    //         if (err || !user){
    //             throw err;
    //         } else {
    //             res.redirect('dashboard');  
    //         }
    //     });
    // },
};
module.exports = UserController;