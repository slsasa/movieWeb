/**
schema 模式定义
对数据和字段进行定义，可以定义数据的类型
*/

var mongoose = require('mongoose')
var Schema =  mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var MovieSchema = new Schema({
	category: {
		type: ObjectId,
		ref: 'categories'
	},
	doctor: String,
	title: String,
	language: String,
	poster: String,
	country: String,
	summary: String,
	flash: String,
	year: Number,
	meta: {			//更新数据时间的纪录
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

MovieSchema.pre('save', function (next) {
	if (this.isNew) {		//如果数据是否是新加的
		this.meta.createAt = this.meta.updateAt = Date.now()	//如果是创建时间等于更新时间
	} else {
		this.meta.updateAt = Date.now()
	}
	next()
})

//这个静态方法不会与数据库进行直接交互，只要在model编译，实例化之后，才会具有这个方法
MovieSchema.statics = {
	fetch: function (cb) {	//用来取出目前数据库中所有数据
		return this
			.find({})
			.sort('meta.updateAt')	//按照更新时间排序
			.exec(cb)
	},
	findById: function (id, cb) {
		return this
			.findOne({_id: id})
			.exec(cb)
	},
	findByName: function (name,cb) {
		return this
			.findOne({'name': name})
			.exec(cb)
		
	}
}

module.exports = MovieSchema