const CharterService = require('../services/charter.service')

class CharterController {
	async create(req, res) {
		try {
			if (req.file) {
				req.body.file = `/uploads/files/${req.file.filename}`
			}

			const result = await CharterService.create(req.body)
			if (result.success) {
				return res.status(201).json(result)
			} else {
				return res.status(400).json(result)
			}
		} catch (error) {
			console.error(error)
			return res.status(500).json({ success: false, message: 'Server error' })
		}
	}
	async update(req, res) {
		try {
			if (req.file) {
				req.body.file = `/uploads/files/${req.file.filename}`
			}
			console.log(req.body)
			const result = await CharterService.update(req.params.id, req.body)
			if (result.success) {
				return res.status(201).json(result)
			} else {
				return res.status(400).json(result)
			}
		} catch (error) {
			console.error(error)
			return res.status(500).json({ success: false, message: 'Server error' })
		}
	}
	async deleted(req, res) {
		try {
			const result = await CharterService.deleted(req.params.id)
			if (result.success) {
				return res.status(200).json(result)
			} else {
				return res.status(400).json(result)
			}
		} catch (error) {
			console.error(error)
			return res.status(500).json({ success: false, message: 'Server error' })
		}
	}
	async getAll(req, res) {
		try {
			const result = await CharterService.getAll(req.params.lang)
			if (result.success) {
				return res.status(200).json(result)
			} else {
				return res.status(400).json(result)
			}
		} catch (error) {
			console.log(error)
			return res.status(500).json({
				success: false, message: "Server xatosi"
			})
		}
	}
	async getAlll(req, res) {
		try {
			const result = await CharterService.getAlll()
			if (result.success) {
				return res.status(200).json(result)
			} else {
				return res.status(400).json(result)
			}
		} catch (error) {
			console.log(error)
			return res.status(500).json({
				success: false, message: "Server xatosi"
			})
		}
	}
}
module.exports = new CharterController()