const { model, Schema } = require('mongoose')

const leaderSchema = new Schema({
	fullName_uz: {
		type: String,
		required: true
	},
	fullName_ru: {
		type: String,
		required: true
	},
	fullName_en: {
		type: String,
		required: true
	},
	position_uz: {
		type: String,
	},
	position_ru: {
		type: String,
	},
	position_en: {
		type: String,
	},
	phone: {
		type: String,
	},
	email: {
		type: String,
	},
	photo: {
		type: String,
	}
}, {
	timestamps: true
})
module.exports = new model('leader', leaderSchema)