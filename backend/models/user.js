var db = require('../db')
var User = db.model('User', {
  name: 	{ type: String, required: true },
  email: 	{ type: String, required: true },
  phone: 	{ type: Number, required: true },
  gender:   { type: String, required: true },
  follower: [{type: String}],
  following: [{type: String}],
  posts: [{
  	date: { type: Date, required: true, default: Date.now },
  	content: {type: String, required: false},
  	image: {type: String, required: true},
  	likes: {type: Number, required:true},
  	comments: [{
  		date: { type: Date, required: true, default: Date.now },
  		content: {type: String, required: true},
  		username: {type: String, required: true}
  	}]
  }],
  password: {type:String, required:true},
  date:     { type: Date, required: true, default: Date.now }
})
module.exports = User