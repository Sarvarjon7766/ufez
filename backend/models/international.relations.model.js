const {model,Schema} = require('mongoose')
const relationSchema = new Schema({
	title_uz: {
		type: String,
		required: true
	},
	title_ru: {
		type: String,
		required: true
	},
	title_en: {
		type: String,
		required: true
	},
	description_uz: {
		type: String,
		required: true
	},
	description_ru: {
		type: String,
		required: true
	},
	description_en: {
		type: String,
		required: true
	},
	photos:[{
		type:String,
		required:false
	}]
})

module.exports = new model('relation',relationSchema)