/**
 * Created by sasa on 17/1/9.
 */

var Category = require('../models/category')

//admin new category page
exports.newCategory = function(req, res) {
    res.render('category_admin', {
        title: '影院后台分类录入页',
        category: {}
    })

}

//admin post movie
exports.save = function(req, res) {
    var _category = req.body.category
    var category = new Category(_category)

    category.save(function(err,category) {
        if (err) {
            console.log(err)
        }
        res.redirect('/admin/category/list')
    })
}

exports.list = function (req, res) {

    Category.fetch(function (err, categories) {
        if (err) {
            console.log(err)
        }
        res.render('category_list', {
            title: '分类列表',
            categories: categories
        })
    })


}