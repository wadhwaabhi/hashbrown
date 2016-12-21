var jwt = require('jsonwebtoken');
var User = require('../models/user');
var config = require('../config');

 module.exports.register = function (req, res, next) {
  var user = new User({
    name: 	req.body.name,
  	email: 	req.body.email,
  	phone: 	req.body.phone,
  	gender: req.body.gender,
  	follower: req.body.follower,
  	following: req.body.following,
  	posts: req.body.posts,
  	likes: req.body.likes,
  	password: req.body.password
  })
  user.save(function (err, user) {
    if (err) { return next(err) }
    res.json(201, user)
  })
}

module.exports.login =  function(req, res){
	console.log("request: ", req.body);
	User.findOne({
		name: req.body.name
	}, function(err, user){
		if(err) throw err;
		if (!user) {
      		res.json({ success: false, message: 'Authentication failed. User not found.' });
    	} else if (user) {
			if (user.password != req.body.password) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else{
				var token = jwt.sign(user, config.secret, {
          		expiresIn: 60*60*24 // expires in 24 hours
        	});
			res.json({
				success:true,
				message:'Login Successful',
				token: token,
				userid: user._id
			});
		}
	}
	});
}
