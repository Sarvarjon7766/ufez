const { model, Schema } = require('mongoose')

const landareaSchema = new Schema({
	title_uz: {
		type: String,
	},
	title_en: {
		type: String,
	},
	title_ru: {
		type: String,
	},
	empty_area_uz: {
		type: String,
	},
	empty_area_en: {
		type: String,
	},
	empty_area_ru: {
		type: String,
	},
	total_area_uz:{
		type:String,
	},
	total_area_en:{
		type:String,
	},
	total_area_ru:{
		type:String,
	},
	photo:{
		type:String,
	}
})
module.exports = new model('landarea', landareaSchema)