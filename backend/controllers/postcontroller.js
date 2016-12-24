var User = require('../models/user');

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

module.exports.addnewpost = function(req, res, next){
	var userid = req.param('userid');
	var post = {
		content: req.body.content,
		image: req.body.image,
		likes: 0,
		comments:[]
	}
	User.update({_id: userid}, {$push:{posts: post}}, function(err, data){
		if(err){
			return next(err);
		}
		res.json({success: true, status: data});
	});
}

module.exports.likepost = function(req, res, next){
	var myid = req.param('userid');
	var postid = req.body.postid;
	var postid = req.body.postid;
	var query = User.update({_id: userid, 'posts._id': postid}, {$inc: {'posts.$.likes': 1}});
	query.exec(function (err, value) {
        if (err) return next(err);
        res.send({success:"true", "likes": value});
    });
}