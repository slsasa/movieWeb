var Index = require('../app/controllers/index')
var User = require('../app/controllers/user')
var Movie = require('../app/controllers/movie')
var Comment = require('../app/controllers/comment')
var Category = require('../app/controllers/category')
var multiparty = require('connect-multiparty');

var MultipartyMiddleware = multiparty();

module.exports = function (app) {

//pre handle user
//app.use 用来加载处理请求的路由模块的参数
    app.use(function (req, res, next) {
        var _user = req.session.user
        app.locals.user = _user
        next()
    })

// index
    app.get('/',Index.index)

//User
    app.post('/user/subsignup', User.subSignup)
    app.post('/user/subsignin', User.subSignin)
    app.get('/user/signup',User.signup)
    app.get('/user/signin',User.signin)
    app.get('/logout', User.logout)
    app.get('/admin/user/list',User.signinRequired, User.adminRequired, User.list)
 
//Movie   
    app.get('/movie/:id', Movie.detail)
    app.get('/admin/movie/new',User.signinRequired, User.adminRequired, Movie.new)
    app.get('/admin/movie/update/:id',User.signinRequired, User.adminRequired, Movie.update)
    app.post('/admin/movie',User.signinRequired, User.adminRequired, MultipartyMiddleware,  Movie.isSave)
    app.post('/admin/movie/new',User.signinRequired, User.adminRequired, Movie.new)
    app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list)
    app.delete("/admin/movie/list", User.signinRequired, User.adminRequired, Movie.del)

    //Comment
    app.post('/user/comment', User.signinRequired,Comment.save)

    //Category
    app.get('/admin/category/new',User.signinRequired,  User.adminRequired, Category.newCategory)
    app.post('/admin/category/movie', User.signinRequired, User.adminRequired, Category.save)
    app.get('/admin/category/list', User.signinRequired,  User.adminRequired,Category.list)
    app.get('/search', Index.search)
}   