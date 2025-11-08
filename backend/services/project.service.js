const { deleted } = require('../controllers/project.controller')
const projectModel = require('../models/project.model')

class ProjectService {
	async create(data) {
		try {
			const project = await projectModel.create(data)
			if (project) {
				return { success: true, message: "Yangi loyiha qo'shildi" }
			} else {
				return { success: false, message: "Loyiha qo'shishda xatolik" }
			}
		} catch (error) {
			console.log(error)
			return { success: false, message: "Server xatosi" }
		}
	}
	async update(id, data) {
		try {
			const project = await projectModel.findByIdAndUpdate(id, data, { new: true })
			if (project) {
				return { success: true, message: "Loyiha yangilandi" }
			} else {
				return { success: false, message: "Loyiha yangilashda xatolik" }
			}
		} catch (error) {
			console.log(error)
			return { success: false, message: "Server xatosi" }
		}
	}
	async deleted(id) {
		try {
			await projectModel.findByIdAndDelete(id)
			return { success: true, message: "Yangi loyiha qo'shildi" }
		} catch (error) {
			console.log(error)
			return { success: false, message: "Server xatosi" }
		}
	}
	async getAll(lang, prossesing) {
		try {
			const projects = await projectModel.find({ prossesing })

			if (!projects || projects.length === 0) {
				return { success: false, message: "Loyiha topilmadi", projects: [] }
			}

			// 🔤 Tilni tekshiramiz (default: uz)
			const validLangs = ["uz", "ru", "en"]
			const selectedLang = validLangs.includes(lang) ? lang : "uz"

			// 🧩 Har bir service obyektini tilga qarab qaytaramiz
			const localizedServices = projects.map((item) => ({
				_id: item._id,
				companyName: item[`companyName_${selectedLang}`],
				projectName: item[`projectName_${selectedLang}`],
				contact: item[`contact_${selectedLang}`],
				createdAt: item.createdAt,
				updatedAt: item.updatedAt,
			}))

			return {
				success: true,
				message: "Loyihalar olindi ",
				projects: localizedServices,
			}
		} catch (error) {
			console.log(error)
			return { success: false, message: "Server xatosi" }
		}
	}
	async getAlll(prossesing) {
		try {
			const projects = await projectModel.find({ prossesing })

			if (!projects || projects.length === 0) {
				return { success: false, message: "Loyiha topilmadi", projects: [] }
			}
			return {
				success: true,
				message: "Loyihalar olindi ",
				projects,
			}
		} catch (error) {
			console.log(error)
			return { success: false, message: "Server xatosi" }
		}
	}
}
module.exports = new ProjectService()