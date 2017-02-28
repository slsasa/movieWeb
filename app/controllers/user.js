
//signup
var User = require('../models/user')

exports.signup = function (req, res) {
    res.render('signup', {
        title: '注册',
        user: {
            name: '',
            password: ''
        }
    })
}

exports.signin = function (req, res) {
    res.render('signin', {
        title: '登录页面',
        user: {
            name: '',
            password: ''
        }

    })
}

exports.subSignup = function (req, res) {
    var _user = req.body.user


    User.find({name: _user.name}, function (err, user) {
        if (err) {
            console.log(err)
        }

        if (user.length != 0) {

            return res.redirect('/')

        } else {
            user = new User(_user)
            user.save(function (err) {
                if (err) {
                    console.log(err)
                }
                res.redirect('/admin/userlist')
            })
        }

    })

}

//signin
exports.subSignin = function (req, res) {
    var _user = req.body.user
    var name = _user.name
    var password = _user.password

    User.findOne({name: name}, function (err, user) {
        if (err) {
            console.log(err)
        }

        if (!user) {
            return res.redirect('/')
        }

        user.comparePassword(password, function (err, isMatch) {
            if (err) {
                console.log(err)
            }

            if (isMatch) {
                req.session.user = user
                return res.redirect('/')
            } else {
                console.log('password is err')
            }

        })

    })

}


//logout

exports.logout = function (req, res) {

    //删除session中user值
    delete req.session.user;
    // delete app.locals.user;
    res.redirect('/')

}

// userlist page
exports.list = function (req, res) {

    User.fetch(function (err, users) {
        if (err) {
            console.log(err)
        }
        res.render('userlist', {
            title: 'initWeb 用户列表页',
            users: users
        })
    })

}

exports.signinRequired = function (req, res, next) {

    var user = req.session.user

    if (!user) {
        return res.redirect('/user/signin')
    }
    next()
}

exports.adminRequired = function (req, res, next) {
    var user = req.session.user

    if (user.role <= 10) {
        return res.redirect('/user/signin')
    }

    next()
}