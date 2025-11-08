const serviceModel = require('../models/service.model')

class ServiceService {
	async update(id, data) {
		try {
			const service = await serviceModel.findByIdAndUpdate(id, data, { new: true })
			if (service) {
				return { success: true, message: "Service yangilandi" }
			} else {
				return { success: false, message: "Service yangilashda xatolik" }
			}
		} catch (error) {
			console.log(error)
			return { success: false, message: "server xatosi" }
		}
	}
	async deleted(id) {
		try {
			await serviceModel.findByIdAndDelete(id)
			return { success: true, message: "Service O'chirildi" }
		} catch (error) {
			console.log(error)
			return { success: false, message: "server xatosi" }
		}
	}
	async create(data) {
		try {
			const service = await serviceModel.create(data)
			if (service) {
				return { success: true, message: "Yangi service qo'shildi" }
			} else {
				return { success: false, message: "Service qo'shishda xatolik" }
			}
		} catch (error) {
			console.log(error)
			return { success: false, message: "server xatosi" }
		}
	}
	async getAll(lang) {
		try {
			const services = await serviceModel.find()

			if (!services || services.length === 0) {
				return { success: false, message: "Xizmatlar topilmadi", services: [] }
			}

			// 🔤 Tilni tekshiramiz (default: uz)
			const validLangs = ["uz", "ru", "en"]
			const selectedLang = validLangs.includes(lang) ? lang : "uz"

			// 🧩 Har bir service obyektini tilga qarab qaytaramiz
			const localizedServices = services.map((item) => ({
				_id: item._id,
				title: item[`title_${selectedLang}`],
				description: item[`description_${selectedLang}`],
				createdAt: item.createdAt,
				updatedAt: item.updatedAt,
			}))

			return {
				success: true,
				message: "Xizmatlar olindi",
				services: localizedServices,
			}
		} catch (error) {
			console.error("getAll error:", error)
			return { success: false, message: "Server xatosi" }
		}
	}
	async getAlll(lag) {
		try {
			const services = await serviceModel.find()

			if (!services || services.length === 0) {
				return { success: false, message: "Xizmatlar topilmadi", services: [] }
			}
			return {
				success: true,
				message: "Xizmatlar olindi",
				services,
			}
		} catch (error) {
			console.error("getAll error:", error)
			return { success: false, message: "Server xatosi" }
		}
	}

}
module.exports = new ServiceService()