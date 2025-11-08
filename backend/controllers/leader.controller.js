const leaderService = require('../services/leader.service')
const leaderModel = require('../models/leader.model')
const fs = require("fs")
const path = require("path")

class LeaderController {
	async create(req, res) {
		try {
			const data = req.body
			const photopath = req.file ? `/uploads/${req.file.filename}` : null
			const result = await leaderService.create({ ...data, photo: photopath })
			if (result.success) {
				return res.status(201).json(result)
			} else {
				return res.status(400).json(result)
			}
		} catch (error) {
			return res.status(500).json(error)
		}
	}
	async getAll(req, res) {
		try {
			const lang = req.params.lang
			const result = await leaderService.getAll(lang)
			if (result.success) {
				return res.status(200).json(result)
			} else {
				return res.status(400).json(result)
			}
		} catch (error) {
			return res.status(500).json(result)
		}
	}
	async getAlll(req, res) {
		try {
			const result = await leaderService.getAlll()
			if (result.success) {
				return res.status(200).json(result)
			} else {
				return res.status(400).json(result)
			}
		} catch (error) {
			return res.status(500).json(result)
		}
	}
	async update(req, res) {
		try {
			const { id } = req.params
			const leader = await leaderModel.findById(id)

			if (!leader) {
				return res.status(404).json({ success: false, message: "Rahbar topilmadi" })
			}

			let updatedData = { ...req.body }

			if (req.file) {
				const uploadsDir = path.join(__dirname, "../uploads")

				if (leader.photo) {
					// Boshidagi / belgini olib tashlaymiz
					const oldPhotoRelative = leader.photo.replace(/^\/+/, "")
					const oldFilePath = path.join(__dirname, "../", oldPhotoRelative)

					console.log("🧩 Eski rasm yo‘li:", oldFilePath)

					if (fs.existsSync(oldFilePath)) {
						fs.unlinkSync(oldFilePath)
						console.log("🗑️ Eski rasm o‘chirildi:", oldFilePath)
					} else {
						console.log("⚠️ Eski rasm topilmadi:", oldFilePath)
					}
				}

				// Yangi rasmni yo‘lini saqlaymiz
				updatedData.photo = `/uploads/${req.file.filename}`
			}


			const result = await leaderService.update(id, updatedData)
			return res.status(result.success ? 200 : 400).json(result)
		} catch (error) {
			console.error("Update error:", error)
			return res.status(500).json({ success: false, message: "Server xatosi" })
		}
	}
	async deleted(req,res){
		try {
			const id = req.params.id
			const result = await leaderService.deleted(id)
			if(result.success){
				return res.status(200).json(result)
			}else{
				return res.status(400).json(result)
			}
		} catch (error) {
			console.log(error.message)
			return res.status(500).json(error)
		}
	}
}
module.exports = new LeaderController()