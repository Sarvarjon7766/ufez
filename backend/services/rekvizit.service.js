const rekvizitModel = require('../models/rekvizit.model')

class RekvizitService {
	async create(data) {
		try {
			const rekvizit = await rekvizitModel.create(data)
			if (rekvizit) {
				return { success: true, message: "Rekvizit yaratildi" }
			} else {
				return { success: false, message: "Rekvizit yaratishda xatolik" }
			}
		} catch (error) {
			console.log(error)
			return { success: false, message: "Server error" }
		}
	}
	async update(id, data) {
		try {
			const rekvizit = await rekvizitModel.findByIdAndUpdate(id, data)
			if (rekvizit) {
				return { success: true, message: "Rekvizit yangilandi" }
			} else {
				return { success: false, message: "Rekvizit yangilashda xatolik" }
			}
		} catch (error) {
			console.log(error)
			return { success: false, message: "Server error" }
		}
	}
	async deleted(id) {
		try {
			await rekvizitModel.findByIdAndDelete(id)
			return { success: true, message: "Rekvizit yaratildi" }
		} catch (error) {
			console.log(error)
			return { success: false, message: "Server error" }
		}
	}
	async getAll(lang) {
		try {
			const rekvizits = await rekvizitModel.find()

			if (!rekvizits || rekvizits.length === 0) {
				return { success: false, message: "Rekvizitlar topilmadi", rekvizits: [] }
			}

			// 🔤 Tilni tekshiramiz (default: uz)
			const validLangs = ["uz", "ru", "en"]
			const selectedLang = validLangs.includes(lang) ? lang : "uz"

			// 🧩 Har bir service obyektini tilga qarab qaytaramiz
			const localizedServices = rekvizits.map((item) => ({
				_id: item._id,
				title: item[`location_${selectedLang}`],
				description: item[`description_${selectedLang}`],
				faks_number: item.faks_number,
				phone_number: item.phone_number,
				createdAt: item.createdAt,
				updatedAt: item.updatedAt,
			}))

			return {
				success: true,
				message: "Rekvizitlar olindi",
				rekvizits: localizedServices,
			}
		} catch (error) {

		}
	}
	async getAlll() {
		try {
			const rekvizits = await rekvizitModel.find()
			if (!rekvizits || rekvizits.length === 0) {
				return { success: false, message: "Rekvizitlar topilmadi", rekvizits: [] }
			}
			return {
				success: true,
				message: "Rekvizitlar olindi",
				rekvizits,
			}
		} catch (error) {

		}
	}
}
module.exports = new RekvizitService()