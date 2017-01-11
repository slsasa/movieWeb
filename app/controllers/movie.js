/**
 * Created by sasa on 16/11/30.
 */
var Movie = require('../models/movie')
var Comment = require('../models/comment')
var Category = require('../models/category')
var _ = require('underscore')


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
    var id = req.body.movie._id
    var movieObj = req.body.movie
    var newCategoryId = movieObj.category
    var _movie

    if (id) {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err)
            }


            var oldCategoryId = movie.category
            if (newCategoryId !== oldCategoryId) {
                Category.update({_id: oldCategoryId}, {$pull: {'movies': movie._id}}, function (err) {
                    console.log(err)
                    _movie = _.extend(movie, movieObj)
                    _movie.save(function (err, movie) {
                        if (err) {
                            console.log(err)
                        }

                        Category
                            .findById(newCategoryId, function (err, category) {
                                category.movies.push(movie)
                                category.save(function (err) {
                                    if (err) {
                                        console.log(err)
                                    }

                                    res.redirect('/movie/' + movie._id)
                                })
                            })

                    })


                })
            }


        })
    }
    else {
        _movie = new Movie(movieObj)

        var categoryId = movieObj.category

        _movie.save(function (err, movie) {
            if (err) {
                console.log(err)
            }
            if (categoryId) {
                Category.findById(categoryId, function (err, category) {

                    category.movies.push(movie._id)

                    category.save(function (err, categories) {
                        if (err) {
                            console.log(err)
                        }
                        res.redirect('/movie/' + movie._id)  //重定向页面
                    })
                })

            }

        })
    }
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
        Movie.remove({_id: id}, function (err) {
            if (err) {
                console.log(err)
            }


                res.redirect('/admin/list')  //重定向页面

        })
    }
}