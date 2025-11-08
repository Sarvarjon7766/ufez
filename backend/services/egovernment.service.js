const egovernmentModel = require('../models/egovernment.model')

class EgovernmentService {
	async create(data) {
		try {
			const egovernment = await egovernmentModel.create(data)
			if (egovernment) {
				return { success: true, message: "Yangi url qo'shildi" }
			} else {
				return { success: false, message: "Url qo'shishdagi xatolik" }
			}
		} catch (error) {
			console.log(error)
			return { success: false, message: "Server xatosi" }
		}
	}
	async update(id, data) {
		try {
			const egovernment = await egovernmentModel.findByIdAndUpdate(id, data, { new: true })
			if (egovernment) {
				return { success: true, message: "Url yangilandi" }
			} else {
				return { success: false, message: "Url yangilashda xatolik" }
			}
		} catch (error) {
			console.log(error)
			return { success: false, message: "Server xatosi" }
		}
	}
	async deleted(id) {
		try {
			await egovernmentModel.findByIdAndDelete(id)
			return { success: true, message: "Url o'chirildi" }
		} catch (error) {
			console.log(error)
			return { success: false, message: "Server xatosi" }
		}
	}
	async getAll(lang) {
		try {
			const egovernments = await egovernmentModel.find()

			if (!egovernments || egovernments.length === 0) {
				return { success: false, message: "Url topilmadi", egovernments: [] }
			}

			// 🔤 Tilni tekshiramiz (default: uz)
			const validLangs = ["uz", "ru", "en"]
			const selectedLang = validLangs.includes(lang) ? lang : "uz"

			// 🧩 Har bir service obyektini tilga qarab qaytaramiz
			const localizedServices = egovernments.map((item) => ({
				_id: item._id,
				title: item[`title_${selectedLang}`],
				url: item.url,
				createdAt: item.createdAt,
				updatedAt: item.updatedAt,
			}))

			return {
				success: true,
				message: "Url olindi",
				egovernments: localizedServices,
			}
		} catch (error) {
			console.log(error)
			return { success: false, message: "Server xatosi" }
		}
	}
	async getAlll() {
		try {
			const egovernments = await egovernmentModel.find()

			if (!egovernments || egovernments.length === 0) {
				return { success: false, message: "Url topilmadi", egovernments: [] }
			}
			return {
				success: true,
				message: "Url olindi",
				egovernments,
			}
		} catch (error) {
			console.log(error)
			return { success: false, message: "Server xatosi" }
		}
	}

}
module.exports = new EgovernmentService()