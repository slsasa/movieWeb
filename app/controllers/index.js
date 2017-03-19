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
    let limit = 2;
    var catId = req.query.cate
    var page = parseInt(req.query.p) || 0
    var index = page * limit
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
                    movies: movies.slice(index, index + limit),
                    totalPage: Math.ceil(movies.length / 2),
                    currentPage: (page + 1)
                })

            })
    }
    else {
        console.log(`search =>>>>>>>>>>>>>`);
        Movie
            .find({'title': new RegExp(movieName + '.*', 'i')})
            .populate('category','name')
            .exec(function ( err, movies) {
                
                if (err) console.log(err)
                console.log(movies.length);

                if (movies.length > 0) {
                    res.render('search', {
                        title: '查询结果',
                        categoryName: '匹配结果 ',
                        movies: movies.slice(index, index+limit),
                        query: 'movieName=' + movieName,
                        totalPage: Math.ceil(movies.length / limit),
                        currentPage: (page + 1)
                    })
                } else {
                    res.render('search', {
                        title: '查询结果',
                        movies: '',
                        categoryName: '匹配结果 ',
                        query: 'movieName=' + '',
                        totalPage: Math.ceil(movies.length / limit),
                        currentPage: (page + 1)
                    })
                }
            })
    }
}