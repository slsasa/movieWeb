var Category = require('../models/category')
// index page
exports.index = function (req, res) {

    console.log('>>>>>>>> user session : ' + JSON.stringify(req.session.user))

    Category
        .find({})
        .populate({path:'movies', options:{limit:5}})
        .exec(function(err, categories) {

                if (err) {
                    console.log(err)
                }

                res.render('index', {
                    title: '首页',
                    categories: categories
                })


        })
}