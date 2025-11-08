const landareaModel = require('../models/landarea.model')

class LandareaService {
	async create(data) {
		try {
			const landarea = await landareaModel.create(data)
			if (landarea) {
				return { success: true, message: "Yangi maydon qo'shildi" }
			} else {
				return { success: false, message: "Maydon qo'shishda xatolik" }
			}
		} catch (error) {
			console.log(error)
			return { success: false, message: "Server xatosi" }
		}
	}
	async getAll(lang) {
		try {
			const areas = await landareaModel.find()

			if (!areas || areas.length === 0) {
				return { success: false, message: "Maydonlar topilmadi", areas: [] }
			}

			// 🔤 Tilni tekshiramiz (default: uz)
			const validLangs = ["uz", "ru", "en"]
			const selectedLang = validLangs.includes(lang) ? lang : "uz"

			// 🧩 Har bir service obyektini tilga qarab qaytaramiz
			const localizedServices = areas.map((item) => ({
				_id: item._id,
				title: item[`title_${selectedLang}`],
				empty_area: item[`empty_area_${selectedLang}`],
				total_area: item[`total_area_${selectedLang}`],
				photo: item.photo,
				createdAt: item.createdAt,
				updatedAt: item.updatedAt,
			}))

			return {
				success: true,
				message: "Maydonlar olindi",
				areas: localizedServices,
			}
		} catch (error) {
			console.log(error)
			return { success: false, message: "Server xatosi" }
		}
	}
}

module.exports = new LandareaService()