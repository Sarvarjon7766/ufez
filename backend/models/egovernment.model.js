const {model,Schema} = require('mongoose')
const egovernmentSchema = new Schema({
	title_uz:{
		type:String,
		required:true
	},
	title_en:{
		type:String,
		required:true
	},
	title_ru:{
		type:String,
		required:true
	},
	url:{
		type:String
	}
},{
	timestamps:true
})
module.exports = new model('egovernment',egovernmentSchema)