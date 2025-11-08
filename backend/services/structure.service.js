const structureModel = require('../models/organization.structure.model')
const fs = require('fs')
const path = require('path')

class StructureService {
	async create(data) {
		try {
			const structure = await structureModel.create(data)
			if (structure) {
				return { success: true, message: "Yangi tuzilma qo'shildi" }
			} else {
				return { success: false, message: "Struktura qo'shishda xatolik bo'ldi" }
			}
		} catch (error) {
			console.log(error)
			return { success: false, message: "Server xatosi" }
		}
	}
	async update(id, data) {
		try {
			console.log(data)
			const structure = await structureModel.findById(id)
			if (!structure) {
				return { success: false, message: "Tuzilma topilmadi" }
			}
			if (data.photo && data.photo !== structure.photo) {
				if (structure.photo) {
					const oldPhotoPath = path.join(__dirname, '..', structure.photo)
					fs.unlink(oldPhotoPath, (err) => {
						if (err) {
							console.error(`❌ Eski rasm o‘chirilmadi: ${oldPhotoPath}`, err)
						} else {
							console.log(`✅ Eski rasm o‘chirildi: ${oldPhotoPath}`)
						}
					})
				}
			}
			if (data.file && data.file !== structure.file) {
				if (structure.file) {
					const oldFilePath = path.join(__dirname, '..', structure.file)
					fs.unlink(oldFilePath, (err) => {
						if (err) {
							console.error(`❌ Eski fayl o‘chirilmadi: ${oldFilePath}`, err)
						} else {
							console.log(`✅ Eski fayl o‘chirildi: ${oldFilePath}`)
						}
					})
				}
			}
			const updatedStructure = await structureModel.findByIdAndUpdate(id, data, { new: true })
			return { success: true, message: "Tuzilma yangilandi", data: updatedStructure }
		} catch (error) {
			console.error("❌ Server xatosi:", error)
			return { success: false, message: "Server xatosi" }
		}
	}
	async deleted(id) {
		try {
			const structure = await structureModel.findById(id)
			if (!structure) {
				return { success: false, message: "Tuzilma topilmadi" }
			}
			if (structure.photo) {
				const photoPath = path.join(__dirname, '..', structure.photo)
				fs.unlink(photoPath, (err) => {
					if (err) {
						console.error(`❌ Photo fayl o‘chirilmadi: ${photoPath}`, err)
					} else {
						console.log(`✅ Photo fayl o‘chirildi: ${photoPath}`)
					}
				})
			}
			if (structure.file) {
				const filePath = path.join(__dirname, '..', structure.file)
				fs.unlink(filePath, (err) => {
					if (err) {
						console.error(`❌ File fayl o‘chirilmadi: ${filePath}`, err)
					} else {
						console.log(`✅ File fayl o‘chirildi: ${filePath}`)
					}
				})
			}
			await structureModel.findByIdAndDelete(id)

			return { success: true, message: "Tuzilma va fayllar muvaffaqiyatli o‘chirildi" }
		} catch (error) {
			console.error("❌ Server xatosi:", error)
			return { success: false, message: "Server xatosi" }
		}
	}

	async getAll() {
		try {
			const structures = await structureModel.find()
			if (structures) {
				return { success: true, message: "Tuzilmalar olindi", structures }
			} else {
				return { success: false, message: "Tuzilmalar topilmadi", structures: [] }
			}
		} catch (error) {
			console.log(error)
			return { success: false, message: error.message }
		}
	}
}
module.exports = new StructureService()