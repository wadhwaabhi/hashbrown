var _ = require('underscore');
var User = require('../models/user');

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

module.exports.users = function (req, res, next) {
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
}

module.exports.feed = function (req, res, next) {
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
}

module.exports.follow = function(req, res, next){
	var userid = req.param('userid');
	var fllw = req.body.userid;
	console.log(userid, fllw);
	if(!fllw){
		res.json({ success: false, message: 'Invalid User to follow'});
	}else if(fllw){
		User.update({ _id: userid }, { $push: { following: fllw } }, function(err, user){
			if(err){
				return(next(err));
			}
			res.json({succes: true, user: user});
		});
	}
}

module.exports.getposts = function(req, res, next){
	var userid = req.param('userid');
	User.findOne({_id: userid}, function(err, user){
		if(err){
			return next(err);
		}
		res.json({success: true, posts: user.posts});
	});
}

module.exports.getpostbyid = function(req, res, next){
	var userid = req.param('userid');
	var postid = req.param('postid');
	var query = User.findOne({_id: userid}, {'posts': {$elemMatch: {'_id': postid}}});
	query.exec(function (err, value) {
        if (err) return next(err);
        res.send({"post":value.posts});
    });
}