const { model, Schema } = require('mongoose')
const projectSchema = new Schema({
	companyName_uz: {
		type: String,
	},
	companyName_ru: {
		type: String,
	},
	companyName_en: {
		type: String,
	},
	projectName_uz: {
		type: String,
	},
	projectName_ru: {
		type: String,
	},
	projectName_en: {
		type: String,
	},
	contact_uz: {
		type: String,
	},
	contact_ru: {
		type: String,
	},
	contact_en: {
		type: String,
	},
	prossesing: {
		type: String,
		enum: ['completed', 'ongoing', 'offer'],
	}
})
module.exports = new model('project', projectSchema)