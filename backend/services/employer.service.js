const employerModel = require('../models/employer.model')

class EmployerService {
	async create(data) {
		try {
			const employer = await employerModel.create(data)
			if (employer) {
				return { success: true, message: "Yangi Xodim qo'shildi" }
			} else {
				return { success: false, message: "Xodim qo'shishda xatolik" }
			}
		} catch (error) {
			console.log(error)
			return { success: false, message: "Server error" }
		}
	}
	async update(id, data) {
		try {
			const employer = await employerModel.findByIdAndUpdate(id, data)
			if (employer) {
				return { success: true, message: "Xodim yangilandi" }
			} else {
				return { success: false, message: "Xodim yangilashda xatolik" }
			}
		} catch (error) {
			console.log(error)
			return { success: false, message: "Server error" }
		}
	}
	async deleted(id) {
		try {
			const employer = await employerModel.findByIdAndDelete(id)
			return { success: true, message: "Xodim O'chirildi" }
		} catch (error) {
			console.log(error)
			return { success: false, message: "Server error" }
		}
	}
	async getAll(lang) {
		try {
			const employers = await employerModel.find()

			if (!employers || employers.length === 0) {
				return { success: false, message: "Xizmatlar topilmadi", employers: [] }
			}

			// 🔤 Tilni tekshiramiz (default: uz)
			const validLangs = ["uz", "ru", "en"]
			const selectedLang = validLangs.includes(lang) ? lang : "uz"

			// 🧩 Har bir service obyektini tilga qarab qaytaramiz
			const localizedServices = employers.map((item) => ({
				_id: item._id,
				fullName: item[`fullName_${selectedLang}`],
				position: item[`position_${selectedLang}`],
				phone: item.phone,
				createdAt: item.createdAt,
				updatedAt: item.updatedAt,
			}))

			return {
				success: true,
				message: "Xizmatlar olindi",
				employers: localizedServices,
			}
		} catch (error) {
			console.log(error)
			return { success: false, message: "Server error" }
		}
	}
	async getAlll() {
		try {
			const employers = await employerModel.find()

			if (!employers || employers.length === 0) {
				return { success: false, message: "Xizmatlar topilmadi", employers: [] }
			}

			return {
				success: true,
				message: "Empoloyer olindi",
				employers,
			}
		} catch (error) {
			console.log(error)
			return { success: false, message: "Server error" }
		}
	}
}

module.exports = new EmployerService()