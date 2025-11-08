const { model, Schema } = require('mongoose')
const rekvizitSchema = new Schema({
	location_uz: {
		type: String
	},
	location_en: {
		type: String
	},
	location_ru: {
		type: String
	},
	faks_number: {
		type: String,
	},
	phone_number: {
		type: String
	},
	description_uz: {
		type: String,
	},
	description_en: {
		type: String,
	},
	description_ru: {
		type: String,
	}
})
module.exports = new model('rekvizit', rekvizitSchema)