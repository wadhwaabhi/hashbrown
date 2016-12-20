var express = require('express')
var bodyParser = require('body-parser')
var Post = require('./models/post')
var User = require('./models/user')
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
var config = require('./config');

var app = express()
// var allowCrossDomain = function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, authorization');

//     next();
// }
// app.use(allowCrossDomain);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.set('superSecret', config.secret);
app.use(morgan('dev'));


app.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key, Authorization');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

app.post('/login', function(req, res){
	console.log("request: ", req.body);
	User.findOne({
		name: req.body.name
	}, function(err, user){
		if(err) throw err;

		// res.setHeader('Access-Control-Allow-Origin', '*');
		// res.setHeader('Access-Control-Allow-Methods', 'POST')
		// res.setHeader('Access-Control-Allow-Methods', 'POST')
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
				token: token,
				userid: user._id
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

//app.use('/api', apiRoutes);

app.get('/api/posts', function (req, res, next) {
  Post.find(function(err, posts) {
    if (err) { return next(err) }
    res.json(posts)
  })
})

app.get('/api/users', function (req, res, next) {
  var userid = req.param('userid'); 
  console.log("User ID", userid);
  User.find({_id: userid}, function(err, users) {
    if (err) {
    	console.log("No user", err);
     	return next(err) 
 	}
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(users)
  })
})


app.post('/register/users', function (req, res, next) {
  var user = new User({
    name: 	req.body.name,
  	email: 	req.body.email,
  	phone: 	req.body.phone,
  	gender: req.body.gender,
  	follower: req.body.follower,
  	following: req.body.following,
  	password: req.body.password
  })
  user.save(function (err, user) {
    if (err) { return next(err) }
    res.json(201, user)
  })
})

function getFollowing(userid, callback){
	User.findOne({_id: userid}, function(err, users) {
    if (err) {
    	console.log("No followers", err);
     	return next(err) 
 	}
    //res.json({following: users.following});
    callback(users.following)

  })
}

function getFeed(following, callback){
	var array = [];
	User.find({_id: {$in: following}}, function(err, posts){
		if(err){
			console.log("No posts", err);
			return next(err);
		}
		posts.forEach(function(item){
			array.push(item.name);
		});
		callback(array);
	});
}

app.get('/api/feed', function (req, res, next) {
  var userid = req.param('userid'); 
  console.log("User ID", userid);
  getFollowing(userid, function(result){
  	//res.json({following: result});
  	getFeed(result, function(posts){
  		res.json(posts);
  		console.log("Post",posts);
  	});
  	console.log(result);
  });
  var array = []
})

app.listen(3000, '0.0.0.0', function () {
  console.log('Server listening on', 3000)
})