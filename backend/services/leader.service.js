const { model } = require('mongoose')
const leaderModel = require('../models/leader.model')
const fs = require("fs")
const path = require("path")

class leaderService {
	async create(data) {
		try {
			console.log(data)
			const leader = await leaderModel.create(data)

			if (leader) {
				return { success: true, message: "Rahbar xodim muvafaqiyatli qo'shildi !!!" }
			} else {
				return { success: false, message: "Yangi rahbar qo'shishda xatolik bo'ldi." }
			}
		} catch (error) {
			console.error(error.message)
			return { success: false, message: "Server xatosi yuz berdi." }
		}
	}
	async getAll(lang) {
		try {
			const leaders = await leaderModel.find()

			if (!leaders || leaders.length === 0) {
				return { success: false, message: "Rahbarlar topilmadi.", leaders: [] }
			}

			// 🔥 Til bo‘yicha qayta shakllantirish
			const mappedLeaders = leaders.map((leader) => {
				let suffix = lang === "ru" ? "ru" : lang === "en" ? "en" : "uz"

				return {
					_id: leader._id,
					fullName: leader[`fullName_${suffix}`],
					position: leader[`position_${suffix}`],
					phone: leader.phone,
					email: leader.email,
					photo: leader.photo,
				}
			})

			return {
				success: true,
				message: "Barcha rahbarlar olindi",
				leaders: mappedLeaders,
			}
		} catch (error) {
			console.error(error.message)
			return { success: false, message: "Server xatosi" }
		}
	}
	async getAlll() {
		try {
			const leaders = await leaderModel.find()

			if (!leaders || leaders.length === 0) {
				return { success: false, message: "Rahbarlar topilmadi.", leaders: [] }
			}

			return {
				success: true,
				message: "Barcha rahbarlar olindi",
				leaders,
			}
		} catch (error) {
			console.error(error.message)
			return { success: false, message: "Server xatosi" }
		}
	}
	async update(id, data) {
		try {
			const leader = await leaderModel.findByIdAndUpdate(id, data, { new: true })
			if (leader) {
				return { success: true, message: "Rahbarning ma'lumotlari yangilandi" }
			} else {
				return { success: false, message: "Rahbarning ma'lumotlarini yangilashda xatolik bo'ldi." }
			}
		} catch (error) {
			console.error(error.message)
		}
	}
	async deleted(id) {
		try {
			const leader = await leaderModel.findById(id)
			if (!leader) {
				return { success: false, message: "Rahbar topilmadi" }
			}
			if (leader.photo) {
				const oldPhotoRelative = leader.photo.replace(/^\/+/, "")
				const oldFilePath = path.join(__dirname, "../", oldPhotoRelative)

				if (fs.existsSync(oldFilePath)) {
					fs.unlinkSync(oldFilePath)
					console.log("🗑️ Eski rasm o‘chirildi:", oldFilePath)
				} else {
					console.log("⚠️ Rasm topilmadi:", oldFilePath)
				}
			}
			await leaderModel.findByIdAndDelete(id)

			return { success: true, message: "Rahbar va uning rasmi o‘chirildi" }
		} catch (error) {
			console.error("Delete error:", error)
			return { success: false, message: "O‘chirishda xatolik yuz berdi" }
		}
	}

}
module.exports = new leaderService()