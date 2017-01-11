/**
 * Created by sasa on 17/1/8.
 */
var mongoose = require('mongoose')
var categorySchema = require('../schemas/category')
var Category = mongoose.model('categories',categorySchema)

module.exports = Category
