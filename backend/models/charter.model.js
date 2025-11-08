const { model, Schema } = require('mongoose')

const charterSchema = new Schema({
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
	signatory_uz: {
		type: String,
		required: true
	},
	signatory_ru: {
		type: String,
		required: true
	},
	signatory_en: {
		type: String,
		required: true
	},
	file:{
		type:String,
	},
	active: {
		type: Boolean,
		default: false
	}

}, {
	timestamps: true
})

module.exports = new model('charter', charterSchema)