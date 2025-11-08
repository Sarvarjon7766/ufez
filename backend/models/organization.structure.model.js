const {model,Schema} = require('mongoose')
const structureSchema = new Schema({
	photo:{
		type:String
	},
	file:{
		type:String
	}
})
module.exports = new model('structure',structureSchema)