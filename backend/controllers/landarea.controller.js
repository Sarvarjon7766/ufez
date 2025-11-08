const LandareaService = require('../services/landarea.service')

class LandareaController {
	async create(req, res) {
		try {
			const data = req.body
			const photopath = req.file ? `/uploads/${req.file.filename}` : null
			const result = await LandareaService.create({ ...data, photo: photopath })
			if (result.success) {
				return res.status(201).json(result)
			} else {
				return res.status(400).json(result)
			}
		} catch (error) {
			console.log(error)
			return res.status(500).json({ success: false, message: "Server xatosi" })
		}
	}
	async getAll(req, res) {
		try {
			const result = await LandareaService.getAll(req.params.lang)
			if (result.success) {
				return res.status(200).json(result)
			} else {
				return res.status(400).json(result)
			}
		} catch (error) {
			console.log(error)
			return res.status(500).json({ success: false, message: "Server xatosi" })
		}
	}
}
module.exports = new LandareaController()