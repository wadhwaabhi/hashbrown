var express = require('express')
var bodyParser = require('body-parser')
var Post = require('./models/post')
var User = require('./models/user')

var app = express()
app.use(bodyParser.json())

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