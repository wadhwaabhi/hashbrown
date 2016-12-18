var express = require('express')
var bodyParser = require('body-parser')
var Post = require('./models/post')
var User = require('./models/user')
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
var config = require('./config');

var app = express()
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}
app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.set('superSecret', config.secret);
app.use(morgan('dev'));

app.post('/login', function(req, res){
	console.log("request: ", req.body);
	User.findOne({
		name: req.body.name
	}, function(err, user){
		if(err) throw err;

		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'POST')
		res.setHeader('Access-Control-Allow-Methods', 'POST')
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

var apiRoutes = express.Router(); 
apiRoutes.use(function(req, res, next){
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if(token){
		console.log("Token", token);
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {
			if (err) {
				console.log("Token error", err)
        		return res.json({ success: false, message: 'Failed to authenticate token.' });    
      		} else {
        		req.decoded = decoded;    
        		next();
      		}
		});
	}else{
		return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
	}
});

app.use('/api', apiRoutes);

app.get('/api/posts', function (req, res, next) {
  Post.find(function(err, posts) {
    if (err) { return next(err) }
    res.json(posts)
  })
})

app.get('/api/users', function (req, res, next) {
  User.find(function(err, users) {
    if (err) { return next(err) }
    res.setHeader('Access-Control-Allow-Origin', '*');
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