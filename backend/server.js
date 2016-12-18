var express = require('express')
var bodyParser = require('body-parser')
var Post = require('./models/post')
var User = require('./models/user')
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
var config = require('./config');

var app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.set('superSecret', config.secret);
app.use(morgan('dev'));

app.post('/login', function(req, res){
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
				var token = jwt.sign(user, app.get('superSecret'), {
          		expiresIn: 60*60*24 // expires in 24 hours
        	});
			res.json({
				success:true,
				message:'Login Successful',
				token: token
			});
		}
	}
	});
});


app.get('/api/posts', function (req, res, next) {
  Post.find(function(err, posts) {
    if (err) { return next(err) }
    res.json(posts)
  })
})

app.get('/api/users', function (req, res, next) {
  User.find(function(err, users) {
    if (err) { return next(err) }
    res.json(users)
  })
})

app.post('/api/posts', function (req, res, next) {
  var post = new Post({
    username: req.body.username,
    body: req.body.body
  })
  post.save(function (err, post) {
    if (err) { return next(err) }
    res.json(201, post)
  })
})

app.post('/api/users', function (req, res, next) {
  var user = new User({
    name: 	req.body.name,
  	email: 	req.body.email,
  	phone: 	req.body.phone,
  	gender: req.body.gender,
  	follower: [],
  	following: [],
  	password: req.body.password
  })
  user.save(function (err, user) {
    if (err) { return next(err) }
    res.json(201, user)
  })
})

app.listen(3000, '0.0.0.0', function () {
  console.log('Server listening on', 3000)
})