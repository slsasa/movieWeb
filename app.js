var express = require('express')
const path = require('path')
var logger = require('morgan')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var mongoose = require('mongoose')
var mongoStore = require('connect-mongo')(session)
var port = process.env.PORT || 3000
var app = express()
var dbUrl = 'mongodb://localhost/movieTest'
mongoose.connect(dbUrl)

app.set('views','./app/views/pages')
app.set('view engine','jade')
app.use(bodyParser.urlencoded({ extended: true}))
app.use(cookieParser());
app.use(session({
    secret: 'movie',
    store : new mongoStore({
        url: dbUrl,
        collection: 'sessions',
        touchAfter: 24*3600
    }),
    resave: false, //don't save session if unmodified
    saveUninitialized:true //创建会话之前存储的东西
}))

//如果env === 开发环境
if ('development' === app.get('env')) {
    app.set('showStackError', true)
    app.use(logger(':method :url :status'))
    app.locals.pretty = true
    mongoose.set('debug', true)
}

require('./config/routes')(app)

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
 //
 // Movies.fetch(function(err,ms){
 // 	console.log("test-----------------------");
 // 	console.log(ms);
 // });


