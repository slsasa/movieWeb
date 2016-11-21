var mongoose = require('mongoose')
var MovieSchema = require('../schemas/movie')
var Movies = mongoose.model('movies',MovieSchema)

module.exports = Movies
