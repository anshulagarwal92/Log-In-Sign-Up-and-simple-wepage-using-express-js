var express = require('express');
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    UserController = require('./routes/UserController'),
    app = express(),
    session = require('express-session'),
    mongoose = require('mongoose'),
    multer  = require('multer'),
    mkdirp = require('mkdirp'),
    MongoStore = require('connect-mongo')(session);

mongoose.connect('mongodb://localhost:27017/mybook');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback() {
    console.log("Database connection opened.");
});

var UserController = new UserController();
var done = false;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'mysupersecretkey',
    store: new MongoStore({mongooseConnection: mongoose.connection}) //for storing session in database
}));

//uploading image to folder uploads  using  multer
var multer1 = multer({ dest: './public/uploads/',
    rename: function (fieldname, filename) {
        return filename+Date.now();
    },
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...')
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path)
        done=true;
    }
});

app.get('/', UserController.indexPage);
app.get('/login', UserController.login);
app.post('/login', UserController.loginPost);
app.get('/logout', UserController.logout);
app.get('/signup', UserController.signup);
app.get('/profile', UserController.profile);
app.post('/signup', UserController.signupPost);
app.post('/upload', multer1, UserController.uploadPhoto);
app.post('/editprofile', UserController.editprofile);
app.get('/dashboard',UserController.dashBoard);



app.use(function(req,res,next){
    req.db = db;
    next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
        res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
