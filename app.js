var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
const path = require('path')
//var _ = require('underscore')
 //extend方法 另外一个对象里面的新字段替换老对象字段
var Movies = require('./models/movie')
var User = require('./models/user')


var port = process.env.PORT || 3000
var app = express()

mongoose.connect('mongodb://localhost/movieTest')

app.set('views','./views/pages')
app.set('view engine','jade')
app.use(bodyParser.urlencoded({ extended: true}))
//app.use(require('body-parser').urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))

app.locals.moment = require('moment')
app.listen(port)

console.log('initWeb started on port' + port)

//测试数据库是否连接成功
mongoose.connection.on("error", function(error) {
    console.log('数据库连接失败' + error);
});

mongoose.connection.on("open", function() {
    console.log('数据库连接成功');
});

 Movies.fetch(function(err,ms){
 	console.log("test-----------------------");
 	console.log(ms);
 });

// index page
app.get('/',function(req,res){
    Movies.fetch(function(err,movies) {
        if(err) {
            console.log(err)
        }

        res.render('index',{
            title: '首页',
            movies:movies
        })

    })


})

//signup
app.post('/user/signup', function(req, res) {
    var _user = req.body.user


    User.find({name:_user.name}, function(err,user) {
        if(err) {
            console.log(err)
        }


        if(user.length != 0) {

            return res.redirect('/')
        }else{
            user = new User(_user)
            user.save(function(err) {
                if (err) {
                    console.log(err)
                }
                res.redirect('/admin/userlist')
            })
        }

    })

})

//signin
app.post('/user/signin', function(req, res) {
    var _user = req.body.user
    var name = _user.name
})


// userlist page
app.get('/admin/userlist',function(req,res){
    User.fetch(function(err,users) {
        if(err) {
            console.log(err)
        }
        res.render('userlist',{
            title: 'initWeb 用户列表页',
            users: users
        })
    })


})


// detail page
app.get('/movie/:id',function(req,res){
    var id = req.params.id

    Movies.findById(id, function(err, movie){
        res.render('detail',{
            title: 'initWeb \t' ,
            movie: movie

        })
    })

})

// detail page
app.get('/admin/movie',function(req,res){
    res.render('admin',{
        title: 'initWeb 后台录入页',
        movie: {
            doctor: '',
            country: '',
            title: '',
            year: 0,
            poster: '',
            language: '',
            flash: '',
            summary: ''
        }
    })
})

////admin update movie
app.get('/admin/update/:id',function(req,res) {
    var id = req.params.id

    if(id) {
        Movies.findById(id,function(err,movie) {
            res.render('admin' , {
                title: '后台更新页',
                movie: movie
            })
        })

    }
})


//admin post movie
app.post('/admin/movie/new', function(req,res) {
    var id = req.body.movie._id
    var movieObj = req.body.movie
    var _movie

    if(id !=='undefined') {
        Movies.findById(id, function(err,movie) {
            if (err) {
                console.log(err)
            }

            _movie = _.extend(movie,movieObj)
            _movie.save(function(err,movie) {
                if(err) {
                    console.log(err)
                }

                res.redirect('/movie/' + movie._id)
            })

        })
    }else {
        _movie = new Movies ({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash

        })

        _movie.save(function(err,movie) {
            if(err) {
                console.log(err)
            }

            res.redirect('/movie/' + movie._id)  //重定向页面
        })
    }
})


// list page
app.get('/admin/list',function(req,res){
    Movies.fetch(function(err,movies) {
        if(err) {
            console.log(err)
        }
        res.render('list',{
            title: '列表页',
            movies: movies
        })
    })


})

//list delete movie
app.delete("/admin/list",function(req,res) {
    var id = req.query.id

    if (id) {
        Movies.remove({_id: id}, function(err) {
            if (err) {
                console.log(err)
            }
            else{

                res.redirect('/admin/list')  //重定向页面
            }
        })
    }
})


