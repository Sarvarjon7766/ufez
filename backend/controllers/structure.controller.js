const StructureService = require("../services/structure.service")
const path = require("path")

class StructureController {
	async create(req, res) {
		try {
			// 🧾 Fayl yo'llarini tayyorlaymiz
			if (req.files) {
				if (req.files.photo && req.files.photo.length > 0) {
					req.body.photo = "/uploads/photos/" + req.files.photo[0].filename
				}
				if (req.files.file && req.files.file.length > 0) {
					req.body.file = "/uploads/files/" + req.files.file[0].filename
				}
			}

			// 🔹 Ma'lumotni saqlash
			const result = await StructureService.create(req.body)

			if (result.success) {
				return res.status(201).json(result)
			} else {
				return res.status(400).json(result)
			}
		} catch (error) {
			console.error(error)
			return res.status(500).json({ success: false, message: "Server xatosi" })
		}
	}
	async update(req, res) {
		try {
			if (req.files) {
				if (req.files.photo && req.files.photo.length > 0) {
					req.body.photo = "/uploads/photos/" + req.files.photo[0].filename
				}
				if (req.files.file && req.files.file.length > 0) {
					req.body.file = "/uploads/files/" + req.files.file[0].filename
				}
			}
			const result = await StructureService.update(req.params.id, req.body)
			if (result.success) {
				return res.status(200).json(result)
			} else {
				return res.status(400).json(result)
			}
		} catch (error) {
			console.error(error)
			return res.status(500).json({ success: false, message: "Server xatosi" })
		}
	}
	async deleted(req, res) {
		try {
			const result = await StructureService.deleted(req.params.id)
			if (result.success) {
				return res.status(200).json(result)
			} else {
				return res.status(400).json(result)
			}
		} catch (error) {
			console.error(error)
			return res.status(500).json({ success: false, message: "Server xatosi" })
		}
	}
	async getAll(req, res) {
		try {
			const result = await StructureService.getAll()
			if (result.success) {
				return res.status(200).json(result)
			} else {
				return res.status(400).json(result)
			}
		} catch (error) {
			console.log(error)
			return res.status(500).json({
				success: false, message: error
			})
		}
	}
}

module.exports = new StructureController()
