let express = require('express')
const path = require('path')
let logger = require('morgan')
let bodyParser = require('body-parser')
let cookieParser = require('cookie-parser')
let fs = require('fs')
let session = require('express-session')
let mongoose = require('mongoose')
let dbUrl = 'mongodb://localhost/movieTest'
mongoose.connect(dbUrl)

//models loading
let models_path = __dirname + '/app/models'
let walk = function(path) {
    fs
        .readdirSync(path)
        .forEach(function(file) {
            let newPath = path + '/' +  file
            let stat = fs.statSync(newPath)

            if (stat.isFile()) {
                if(/(.*)\.(js|coffee)/.test(file)) {
                    require(newPath)
                }
            }
            else if (stat.isDirectory()) {
                    walk(newPath)
            }
        })
}

walk(models_path)

let mongoStore = require('connect-mongo')(session)
let port = process.env.PORT || 3000
let app = express()


app.set('views','./app/views/pages')
app.set('view engine','jade')
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



if ('development' === app.get('env')) {
    app.set('showStackError', true)
    app.use(logger(':method :url :status'))
    app.locals.pretty = true
    mongoose.set('debug', true)
}


app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser({uploadDir: './public/upload'}))
require('./config/routes')(app)


app.locals.moment = require('moment')
app.listen(port)
