var express = require('express'),
	router = express.Router();

/* GET SignUp page. */
router.get('/', function(req, res, next) {
	res.render('signup', { title: 'signup' });
});

module.exports = router;
