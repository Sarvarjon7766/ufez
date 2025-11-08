const { model, Schema } = require('mongoose')

const employerSchema = new Schema({
	fullName_uz: {
		type: String,
		required: true,
	},
	fullName_en: {
		type: String,
		required: true,
	},
	fullName_ru: {
		type: String,
		required: true,
	},
	position_uz: {
		type: String,
	},
	position_en: {
		type: String,
	},
	position_ru: {
		type: String,
	},
	phone: {
		type: String,
	}
}, {
	timestamps: true
})

module.exports = new model('employer', employerSchema)