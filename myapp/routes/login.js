var express = require('express'),
	router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
	res.render('login', { title: 'login' });
});

module.exports = router;
