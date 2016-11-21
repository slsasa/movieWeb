var mongoose = require('mongoose')
var UserSchemas = require('../schemas/user')

var User = mongoose.model('users',UserSchemas)

module.exports = User
