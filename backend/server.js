var express = require('express')
var bodyParser = require('body-parser')
var Post = require('./models/post')
var User = require('./models/user')
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
var config = require('./config');

var loginController = require('./controllers/logincontroller');
var userController = require('./controllers/usercontroller');

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
app.post('/register', loginController.register);

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

app.get('/api/user/info', userController.users);
app.get('/api/user/feed', userController.feed);
app.get('/api/user/posts', userController.getposts);
app.get('/api/user/post', userController.getpostbyid);
app.post('/api/user/follow', userController.follow);


app.listen(3000, '0.0.0.0', function () {
  console.log('Server listening on', 3000)
})