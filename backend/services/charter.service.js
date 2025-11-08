const charterModel = require('../models/charter.model')
const fs = require("fs")
const path = require("path")

class CharterService {
	async create(data) {
		try {
			const charter = await charterModel.create(data)
			if (charter) {
				return { success: true, message: "Yangi nizom qo'shildi" }
			} else {
				return { success: false, message: "Yangi nizom qo'shishda xatolik bo'ldi" }
			}
		} catch (error) {
			console.log(error)
			return { success: false, message: error.message }
		}
	}
	async update(id, data) {
		try {
			const charter = await charterModel.findById(id)
			if (!charter) {
				return { success: false, message: "Nizom topilmadi" }
			}
			if (data.oldFile) {
				const oldFilePath = path.join(__dirname, "..", data.oldFile)
				if (fs.existsSync(oldFilePath)) {
					fs.unlinkSync(oldFilePath)
					console.log(`🗑️ Eski fayl o‘chirildi: ${data.oldFile}`)
				} else {
					console.log(`⚠️ Eski fayl topilmadi: ${data.oldFile}`)
				}
				delete data.oldFile
			}

			const updated = await charterModel.findByIdAndUpdate(id, data, { new: true })
			if (updated) {
				return { success: true, message: "Nizom yangilandi", data: updated }
			} else {
				return { success: false, message: "Yangilanishda xatolik yuz berdi" }
			}
		} catch (error) {
			console.error("❌ Xatolik:", error)
			return { success: false, message: "Server xatosi" }
		}
	}
	async deleted(id) {
		try {
			const charter = await charterModel.findById(id)
			if (!charter) {
				return { success: false, message: "Nizom topilmadi" }
			}
			if (charter.file) {
				const filePath = path.join(__dirname, "..", charter.file)
				if (fs.existsSync(filePath)) {
					fs.unlinkSync(filePath)
					console.log(`🗑️ Fayl o‘chirildi: ${charter.file}`)
				} else {
					console.log(`⚠️ Fayl topilmadi: ${charter.file}`)
				}
			}
			await charterModel.findByIdAndDelete(id)

			return { success: true, message: "Nizom muvaffaqiyatli o‘chirildi" }
		} catch (error) {
			console.error("❌ Xatolik:", error)
			return { success: false, message: "Server xatosi" }
		}
	}
	async getAll(lang) {
		try {
			const charters = await charterModel.find({ "active": true })

			if (!charters || charters.length === 0) {
				return { success: false, message: "Nizomlar toplmadi", charters: [] }
			}

			// 🔤 Tilni tekshiramiz (default: uz)
			const validLangs = ["uz", "ru", "en"]
			const selectedLang = validLangs.includes(lang) ? lang : "uz"

			// 🧩 Har bir service obyektini tilga qarab qaytaramiz
			const localizedServices = charters.map((item) => ({
				_id: item._id,
				title: item[`title_${selectedLang}`],
				description: item[`description_${selectedLang}`],
				signatory: item[`signatory_${selectedLang}`],
				file: item.file,
				createdAt: item.createdAt,
				updatedAt: item.updatedAt,
			}))

			return {
				success: true,
				message: "Xizmatlar olindi",
				charters: localizedServices,
			}
		} catch (error) {

		}
	}
	async getAlll() {
		try {
			const charters = await charterModel.find()
			if (!charters || charters.length === 0) {
				return { success: false, message: "Nizomlar toplmadi", charters: [] }
			}
			return {
				success: true,
				message: "Nizomlar olindi",
				charters,
			}
		} catch (error) {

		}
	}
}
module.exports = new CharterService()