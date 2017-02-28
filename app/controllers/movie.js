var Movie = require('../models/movie')
var Comment = require('../models/comment')
var Category = require('../models/category')
var Async = require('async')
var Multiparty = require('connect-multiparty')
var fs = require('fs')
var path = require('path')
var _ = require('underscore')

var MultipartyMiddleware = Multiparty()

// detail page
exports.detail = function (req, res) {
    var id = req.params.id

    Movie.findOne({_id:id})
        .populate('category','name')
        .exec(function (err, movie) {
            Comment
                    .find({movie:id})
                    .populate('from', 'name')
                    .populate('reply.from reply.to', 'name')
                    .exec(function (err, comments) {
                        console.log('comments' + comments)
                        res.render('detail', {
                            title: ' \t',
                            movie: movie,
                            comments: comments,
                        })
                    })
        })

}

// admin new page
exports.new = function (req, res) {
    Category.fetch(function (err, categories) {
        if (err) {
            console.log(err)
        }
        res.render('admin', {
            title: '后台录入页',
            movie: {},
            categories: categories
        })
    })

}

////admin update movie
exports.update = function (req, res) {
    var id = req.params.id

    if (id) {
        Movie.findById(id, function (err, movie) {
            Category.fetch(function (err, categories) {
                res.render('admin', {
                    title: '后台更新页',
                    movie: movie,
                    categories: categories
                })
            })

        })

    }
}


//admin post movie ,movie save
exports.isSave = function (req, res) {
    var movieObj = req.body.movie
    var id = movieObj._id
    var newCategoryId = movieObj.category
    var categoryName = movieObj.categoryName
    var _movie
    var posterData = req.files.uploadPoster
    var filePath = posterData.path
    var originalFilename = posterData.originalFilename

    Async.waterfall([
        function (callback) {
            if (originalFilename) {
                fs.readFile(filePath, function(err, data) {
                    var timestamp = Date.now()
                    var type = posterData.type.split('/')[1]
                    var poster = timestamp + '.' + type
                    var newPath = path.join(__dirname, '../../', '/public/upload/' + poster)

                    fs.writeFile(newPath, data, function(err) {
                        req.poster = poster
                        callback()
                    })
                })
            }
            else {
                callback()
            }

        },
         function (callback) {
            if(req.poster) {
                movieObj.poster = req.poster
            }

            callback()

        },
        function (callback) {
            if (id) {
                Movie.findById(id, function (err, movie) {
                    var oldCategoryId = movie.category

                    if (err) console.log(err)

                    Category.findOne({$or: [{_id: newCategoryId}, {'name': categoryName}]},
                        function (err, category) {
                            if (err) console.log(err)

                            if (category._id !== oldCategoryId) {
                                Category.update({_id: oldCategoryId}, {$pull: {'movies': movie._id}},
                                    function (err) {
                                        if (err) {
                                            console.log(err)
                                        }

                                        _movie = _.extend(movie, movieObj)
                                        callback(null, _movie, category)
                                    })
                            }
                            else {
                                callback(null, _movie)
                            }
                        }
                    )
                })
            }
            else {

                _movie = new Movie(movieObj)
                Category.findOne({$or:[{_id:newCategoryId},{'name':categoryName}]}, function (err , category) {
                    if (category) {
                        _movie.category = category._id
                        // console.log('_movie新建有category=======' + JSON.stringify(_movie))
                        callback(null, _movie, category)
                    }
                    else {

                        callback(null, _movie)
                    }
                })

            }
        },
        function (_movie,category) {

            if (category) {
                _movie.save(function (err, movie) {
                    if (err) {
                        console.log(err)
                    }
                    category.movies.push(movie)
                    category.save(function (err) {
                        if (err) {
                            console.log(err)
                        }
                        res.redirect('/movie/' + movie._id)
                    })
                })
            }
            else {
                var category = new Category({
                    name: categoryName,
                    movies: []
                })
                category.save(function (err, category) {
                    _movie.category = category._id
                    _movie.save(function (err, movie) {
                        category.movies.push(movie)
                        category.save(function (err) {
                            console.log(err)
                            res.redirect('/movie/' + movie._id)
                        })
                    })
                })
            }
        }]


    )
}


// list page
exports.list = function (req, res) {

    Movie
        .find({})
        .populate('category','name')
        .exec(function (err , movies) {
            if (err) {
                console.log(err)
            }

            res.render('list', {
                title: '列表页',
                movies: movies
            })

        })

}

//list delete movie
exports.del = function (req, res) {
    var id = req.query.id


    if (id) {
        Movie.findById(id,function (err, movie) {
            var categoryId = movie.category
            Category.update({_id: categoryId}, {$pull: {'movies': id}}, function (err) {
                if (err) {console.log(err)}
                Movie.remove({_id: id}, function (err) {
                    if (err) {
                        console.log(err)
                    }

                    res.redirect('/admin/movie/list')  //重定向页面

                })
            })
        })

    }
}