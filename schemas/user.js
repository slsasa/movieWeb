var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
var SALT_WORK_FACTOR = 10 //计算强度

var UserSchema = new mongoose.Schema({
    name:{
        unique:true,    //SQL UNIQUE 约束唯一
        type: String
    },
    password:{
        unique:true,
        type: String
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
    if(this.isNew){		//如果数据是否是新加的
        this.meta.createAt = this.meta.updateAt = Date.now()	//如果是创建时间等于更新时间
    }else{
        this.meta.updateAt = Date.now()
    }

    //生成随机盐水，拿到密码，把密码与随机盐混合加密生成密钥
    //SALT_WORT_FACTOR 计算强度（计算密码所需要的资源和时间），越大越好，百度上说建议用12，尴尬
    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt) {
        if (err) return next(err)

            bcrypt.hash(user.password,salt,function(err,hash) {
                if (err) return next(err)

                user.password = hash
            })
    })
    next()

})

UserSchema.statics = {
    fetch: function(cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function(id, cb){
        return this
            .findOne({_id: id})
            .exec(cb)
    }
}

module.exports = UserSchema
