const relationModel = require('../models/international.relations.model')
const fs = require('fs')
const path = require('path')
class RelationService {
	async create(data) {
		try {
			const relation = await relationModel.create(data)
			if (relation) {
				return { success: true, message: "Ma'lumot qo'shildi" }
			} else {
				return { success: false, message: "Ma'lumot qo'shishda xatolik" }
			}
		} catch (error) {
			console.log(error)
			return { success: false, message: error.message }
		}
	}
	async update(id, data) {
		try {
			const relation = await relationModel.findById(id)
			if (!relation) {
				return { success: false, message: "Yangilik topilmadi" }
			}

			let updatedPhotos = relation.photos || []

			// 🔹 removedPhotos bo'lsa fayllarni o'chirish va qolganlarni ajratish
			if (data.deletedPhotos) {
				const removedFiles = Array.isArray(data.deletedPhotos)
					? data.deletedPhotos
					: [data.deletedPhotos]

				for (const filePath of removedFiles) {
					const absolutePath = path.join(__dirname, '..', filePath)
					if (fs.existsSync(absolutePath)) {
						fs.unlinkSync(absolutePath)
						console.log(`✅ Fayl o‘chirildi: ${filePath}`)
					} else {
						console.log(`⚠️ Fayl topilmadi: ${filePath}`)
					}
				}

				updatedPhotos = updatedPhotos.filter(photo => !removedFiles.includes(photo))
				delete data.deletedPhotos
			}

			// 🔹 yangi photos bo‘lsa eski rasmlarga qo‘shish
			if (data.photos && data.photos.length) {
				updatedPhotos = [...updatedPhotos, ...data.photos]
			}

			// 🔹 data.photos ni yangilash
			data.photos = updatedPhotos

			// 🔹 yangilash
			const updated = await relationModel.findByIdAndUpdate(id, data, { new: true })

			if (updated) {
				return { success: true, message: "Yangilik yangilandi", data: updated }
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
			const relation = await relationModel.findById(id)

			if (!relation) {
				return { success: false, message: "Yangilik topilmadi" }
			}
			if (relation.photos && relation.photos.length) {
				for (const photoPath of relation.photos) {
					const filePath = path.join(__dirname, '..', photoPath)
					fs.unlink(filePath, (err) => {
						if (err) {
							console.error(`❌ Fayl o'chirilmadi: ${filePath}`, err)
						} else {
							console.log(`✅ Fayl o'chirildi: ${filePath}`)
						}
					})
				}
			}
			await relationModel.findByIdAndDelete(id)
			return { success: true, message: "Ma'lumot yangilandi" }
		} catch (error) {
			console.log(error)
			return { success: false, message: error.message }
		}
	}
	async getAll(lang) {
		try {
			const relations = await relationModel.find().sort({ _id: -1 })
			if (!relations || relations.length === 0) {
				return { success: false, message: "Xalqaro aloqalar topilmadi", relations: [] }
			}
			// 🔤 Tilni tekshiramiz (default: uz)
			const validLangs = ["uz", "ru", "en"]
			const selectedLang = validLangs.includes(lang) ? lang : "uz"

			// 🧩 Har bir service obyektini tilga qarab qaytaramiz
			const localizedServices = relations.map((item) => ({
				_id: item._id,
				title: item[`title_${selectedLang}`],
				description: item[`description_${selectedLang}`],
				photos: item.photos,
				createdAt: item.createdAt,
				updatedAt: item.updatedAt,
			}))
			return {
				success: true,
				message: "Xizmatlar olindi",
				relations: localizedServices,
			}
		} catch (error) {
			console.log(error.message)
			return { success: false, message: error.message }
		}
	}
	async getAlll() {
		try {
			const relations = await relationModel.find().sort({ _id: -1 })
			if (!relations || relations.length === 0) {
				return { success: false, message: "Xalqaro aloqalar topilmadi", relations: [] }
			}
			return {
				success: true,
				message: "Xalqaro aloqalar olindi",
				relations,
			}
		} catch (error) {
			console.log(error.message)
			return { success: false, message: error.message }
		}
	}
}
module.exports = new RelationService()