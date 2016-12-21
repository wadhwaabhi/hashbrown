var express = require('express')
var bodyParser = require('body-parser')
var Post = require('./models/post')
var User = require('./models/user')
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
var config = require('./config');
var _ = require('underscore');

var loginController = require('./controllers/logincontroller');

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

app.post('/login', loginController.login);
app.post('/register/users', loginController.register);

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
			//array.push(item.posts);
			var name = item.name;
			item.posts.forEach(function(post){
				if(post){
					array.push({name:name, post: post})
			}
			});
		});
		_.sortBy(array, function(o) { return new Date(o.post.date); })
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