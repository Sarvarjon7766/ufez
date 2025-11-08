const serviceService = require('../services/service.service')
const ServiceService = require("../services/service.service")

class ServiceController {
	async update(req, res) {
		try {
			const result = await ServiceService.update(req.params.id, req.body)
			if (result.success) {
				return res.status(201).json(result)
			} else {
				return res.status(400).json(result)
			}
		} catch (error) {
			return res.status(500).json({ success: false, message: "Server xatosi" })
		}
	}
	async deleted(req, res) {
		try {
			const result = await ServiceService.deleted(req.params.id)
			if (result.success) {
				return res.status(200).json(result)
			} else {
				return res.status(400).json(result)
			}
		} catch (error) {
			return res.status(500).json({ success: false, message: "Server xatosi" })
		}
	}
	async create(req, res) {
		try {
			const data = req.body
			console.log(data)
			const result = await ServiceService.create(data)
			if (result.success) {
				return res.status(201).json(result)
			} else {
				return res.status(400).json(result)
			}
		} catch (error) {
			return res.status(500).json({ success: false, message: "Server xatosi" })
		}
	}
	async getAll(req, res) {
		try {
			const result = await serviceService.getAll(req.params.lang)
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
	async getAlll(req, res) {
		try {
			const result = await serviceService.getAlll()
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
module.exports = new ServiceController()