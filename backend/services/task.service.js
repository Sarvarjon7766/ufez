const taskModel = require('../models/task.model')

class TaskService {
	async create(data) {
		try {
			const task = await taskModel.create(data)
			if (data) {
				return { success: true, message: "Yangi tasklar qo'shildi" }
			} else {
				return { success: false, message: "Task qo'shishda xatolik" }
			}
		} catch (error) {
			console.log(error)
			return { success: false, message: "server error" }
		}
	}
	async update(id, data) {
		try {
			const task = await taskModel.findByIdAndUpdate(id, data, { new: true })
			if (task) {
				return { success: true, message: "Vazifalar yangilandi" }
			} else {
				return { success: false, message: "Task yangilashda xatolik" }
			}
		} catch (error) {
			console.log(error)
			return { success: false, message: "server error" }
		}
	}
	async deleted(id) {
		try {
			await taskModel.findByIdAndDelete(id)
			return { success: true, message: "Vazifalar yangilandi" }
		} catch (error) {
			console.log(error)
			return { success: false, message: "server error" }
		}
	}
	async getAll(lang) {
		try {
			const tasks = await taskModel.find()

			if (!tasks || tasks.length === 0) {
				return { success: false, message: "Vazifalari topilmadi", tasks: [] }
			}

			// 🔤 Tilni tekshiramiz (default: uz)
			const validLangs = ["uz", "ru", "en"]
			const selectedLang = validLangs.includes(lang) ? lang : "uz"

			// 🧩 Har bir service obyektini tilga qarab qaytaramiz
			const localizedServices = tasks.map((item) => ({
				_id: item._id,
				description: item[`description_${selectedLang}`],
				createdAt: item.createdAt,
				updatedAt: item.updatedAt,
			}))

			return {
				success: true,
				message: "Xizmatlar olindi",
				tasks: localizedServices,
			}
		} catch (error) {
			console.log(error.message)
			return { success: false, message: "Server xatosi" }
		}
	}
	async getAlll() {
		try {
			const tasks = await taskModel.find()

			if (!tasks || tasks.length === 0) {
				return { success: false, message: "Vazifalari topilmadi", tasks: [] }
			}
			return {
				success: true,
				message: "Tasklar olindi",
				tasks,
			}
		} catch (error) {
			console.log(error.message)
			return { success: false, message: "Server xatosi" }
		}
	}
}

module.exports = new TaskService()