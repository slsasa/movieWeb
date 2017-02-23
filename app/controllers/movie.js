/**
 * Created by sasa on 16/11/30.
 */
let Movie = require('../models/movie')
let Comment = require('../models/comment')
let Category = require('../models/category')
let Async = require('async')
let Multiparty = require('connect-multiparty')
let fs = require('fs')
let path = require('path')
let _ = require('underscore')

let MultipartyMiddleware = Multiparty()

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


// todo buff_path 保存用户上传的文件的缓冲.
//admin post movie ,movie save
exports.isSave = function (req, res) {
    var body = req.body
    var id = body['movie._id']
    var movieObj = body['movie']
    var newCategoryId = movieObj['category']
    var categoryName = movieObj['categoryName']
    var _movie

    if (id) {
        Movie.findById(id, function (err, movie) {
            var oldCategoryId = movie.category
            
            if (err) {console.log(err)}

            Category.findOne({$or:[{_id:newCategoryId},{'name':categoryName}]}, function (err, category) {
                if (err) {console.log(err)}
                if (category._id !== oldCategoryId) {
                    Category.update({_id:oldCategoryId},{$pull:{'movies':movie._id}},
                    function (err) {
                        if (err) {console.log(err)}

                        _movie = _.extend(movie, movieObj)
                        _movie.save(function (err,movie) {

                            if (err) {console.log(err)}

                            category.movies.push(movie)
                            category.save(function (err) {
                                if (err) {console.log(err)}

                                res.redirect('/movie/' + movie._id)
                            })
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
            })

            
        })

    }
    else {
        _movie = new Movie(movieObj)

        Category.findOne({$or:[{_id:newCategoryId},{'name':categoryName}]}, function (err , category) {
            if (category) {

                    _movie.category = category._id
                    _movie.save(function (err, movie) {
                        category.movies.push(movie)
                        category.save(function (err) {

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