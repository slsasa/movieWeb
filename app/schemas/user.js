var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')
//var SALT_WORK_FACTOR = 10 //计算强度
const saltRounds = 10;

var UserSchema = new mongoose.Schema({
    name: {
        unique: true,    //SQL UNIQUE 约束唯一
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: Number,
        default: 0
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})


UserSchema.pre('save', function (next) {
    var user = this

    if (this.isNew) {		//如果数据是否是新加的
        this.meta.createAt = this.meta.updateAt = Date.now()	//如果是创建时间等于更新时间
    } else {
        this.meta.updateAt = Date.now()
    }


    var hash = bcrypt.hashSync(this.password);
    this.password = hash;
    next()

})


UserSchema.methods = {
    comparePassword: function (_password, cb) {
        bcrypt.compare(_password, this.password, function (err, isMatch) {
            if (err) return cb(err)
            cb(null, isMatch)
        })
    }
}

UserSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function (id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb)
    }
}

module.exports = UserSchema
