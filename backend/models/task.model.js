const { model, Schema } = require('mongoose')

const taskSchema = new Schema({
	description_uz: {
		type: String
	},
	description_ru: {
		type: String
	},
	description_en: {
		type: String
	},

}, {
	timestamps: true
})

module.exports = new model('task', taskSchema)