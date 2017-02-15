var Category = require('../models/category')
var Movie = require('../models/movie')
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

exports.search = function (req, res) {
    var catId = req.query.cate
    var page = parseInt(req.query.p, 10) || 0
    var index = page * 2
    var movieName = req.query.movieName
    if ( catId ) {
        Category
            .findOne({_id: catId})
            .populate({
                path: 'movies',
                select: 'title poster',
            })
            .exec(function (err, category) {
                if (err) {
                    console.log(err)
                }
                var category = category || {}
                var movies = category.movies || []

                res.render('search', {
                    title: '查询结果',
                    categoryName: category.name,
                    query: 'cat=' + catId,
                    movies: movies.slice(index, index + 2),
                    totalPage: Math.ceil(movies.length / 2),
                    currentPage: (page + 1)
                })

            })
    }
    else {

        Movie
            .find({'title': new RegExp(movieName + '.*', 'i')})
            .populate('category','name')
            .exec(function ( err, movies) {

                if (err) console.log(err)

                if (movies) {
                    res.render('search', {
                        title: '查询结果',
                        movies: movies,
                        categoryName: movies[0].category.name,
                        query: 'title=' + movieName,
                        totalPage: Math.ceil(movies.length / 2),
                        currentPage: (page + 1)
                    })
                }
            })
    }
}