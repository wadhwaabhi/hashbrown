var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/hashbrown', function () {
  console.log('mongodb connected')
})
module.exports = mongoose