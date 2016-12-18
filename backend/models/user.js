var db = require('../db')
var User = db.model('User', {
  name: 	{ type: String, required: true },
  email: 	{ type: String, required: true },
  phone: 	{ type: Number, required: true },
  gender:   { type: String, required: true },
  follower: { type: Array, required: false},
  following: {type: Array, required: false},
  password: {type:String, required:true},
  date:     { type: Date, required: true, default: Date.now }
})
module.exports = User