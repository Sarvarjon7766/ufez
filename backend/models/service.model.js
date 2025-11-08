const { model, Schema } = require('mongoose')
const serviceSchema = new Schema({
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
	}
}, {
	timestamps: true
})
module.exports = new model('service', serviceSchema)