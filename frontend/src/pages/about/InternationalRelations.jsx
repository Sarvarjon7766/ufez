import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import axios from "axios"
import { ChevronLeft, ChevronRight, X, Calendar, Globe } from "lucide-react"

const InternationalRelations = () => {
	const [relations, setRelations] = useState([])
	const [loading, setLoading] = useState(true)
	const [expanded, setExpanded] = useState({})
	const [language, setLanguage] = useState("uz")
	const [selectedImage, setSelectedImage] = useState(null)

	const BASE_URL = import.meta.env.VITE_BASE_URL

	// Tarjima matnlari
	const translations = {
		uz: {
			title: "Xalqaro aloqalar",
			loading: "Yuklanmoqda...",
			more: "Batafsil",
			less: "Kamroq",
			noData: "Hozircha xalqaro aloqalar ma'lumotlari mavjud emas.",
			viewAll: "Barcha rasmlar"
		},
		ru: {
			title: "Международные связи",
			loading: "Загрузка...",
			more: "Подробнее",
			less: "Меньше",
			noData: "Информация о международных связях пока недоступна.",
			viewAll: "Все фото"
		},
		en: {
			title: "International Relations",
			loading: "Loading...",
			more: "More",
			less: "Less",
			noData: "International relations information is not available yet.",
			viewAll: "All photos"
		}
	}

	const t = translations[language] || translations.uz

	// LocalStorage'dan tilni o'qish
	useEffect(() => {
		const savedLang = localStorage.getItem("lang") || "uz"
		setLanguage(savedLang)
		fetchRelations(savedLang)
	}, [])

	// Til o'zgarganda yangilash
	useEffect(() => {
		const handleStorageChange = () => {
			const savedLang = localStorage.getItem("lang") || "uz"
			if (savedLang !== language) {
				setLanguage(savedLang)
				fetchRelations(savedLang)
			}
		}

		window.addEventListener('storage', handleStorageChange)
		const interval = setInterval(() => {
			const savedLang = localStorage.getItem("lang") || "uz"
			if (savedLang !== language) {
				setLanguage(savedLang)
				fetchRelations(savedLang)
			}
		}, 1000)

		return () => {
			window.removeEventListener('storage', handleStorageChange)
			clearInterval(interval)
		}
	}, [language])

	// API dan ma'lumot olish
	const fetchRelations = async (lang = language) => {
		try {
			setLoading(true)
			const res = await axios.get(`${BASE_URL}/api/relation/getAll/${lang}`)
			if (res.data.success) {
				setRelations(res.data.relations)
			}
		} catch (error) {
			console.error("Xalqaro aloqalarni olishda xatolik:", error)
			// Example data
			const exampleData = [
				{
					id: 1,
					title: "O'zbekiston va Qozog'iston hamkorligi",
					description: "O'zbekiston va Qozog'iston o'rtasidagi iqtisodiy va madaniy hamkorlik kuchaymoqda. Savdo hajmi va turizm sohalari bo'yicha yangi shartnomalar imzolandi.",
					photos: ["/partner1.jpg", "/partner2.jpg", "/partner3.jpg"],
					date: "2025-01-15"
				},
				{
					id: 2,
					title: "Xalqaro ta'lim loyihalari",
					description: "O'zbekiston bir qator xalqaro universitetlar bilan hamkorlik qiladi. Talabalar almashinuvi va qo'shma dasturlar yo'lga qo'yildi.",
					photos: ["/partner4.jpg", "/partner5.jpg"],
					date: "2025-03-22"
				},
				{
					id: 3,
					title: "Qishloq xo'jaligi hamkorligi",
					description: "Markaziy Osiyo davlatlari bilan qishloq xo'jaligi bo'yicha tajriba almashish loyihalari yo'lga qo'yildi.",
					photos: ["/partner6.jpg", "/partner7.jpg", "/partner8.jpg"],
					date: "2025-05-10"
				},
			]
			setRelations(exampleData)
		} finally {
			setLoading(false)
		}
	}

	const toggleExpand = (id) => {
		setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
	}

	const openImageModal = (relation, imageIndex = 0) => {
		setSelectedImage({ relation, imageIndex })
	}

	const closeImageModal = () => {
		setSelectedImage(null)
	}

	const nextModalImage = () => {
		if (selectedImage) {
			const totalImages = selectedImage.relation.photos.length
			setSelectedImage(prev => ({
				...prev,
				imageIndex: (prev.imageIndex + 1) % totalImages
			}))
		}
	}

	const prevModalImage = () => {
		if (selectedImage) {
			const totalImages = selectedImage.relation.photos.length
			setSelectedImage(prev => ({
				...prev,
				imageIndex: (prev.imageIndex - 1 + totalImages) % totalImages
			}))
		}
	}

	// Keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (!selectedImage) return
			if (e.key === 'Escape') closeImageModal()
			else if (e.key === 'ArrowRight') nextModalImage()
			else if (e.key === 'ArrowLeft') prevModalImage()
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [selectedImage])

	if (loading) {
		return (
			<div className="flex justify-center items-center py-24">
				<div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
				<span className="ml-3 text-gray-600">{t.loading}</span>
			</div>
		)
	}

	return (
		<div className="min-h-screen py-12">
			{/* Modal */}
			<AnimatePresence>
				{selectedImage && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
						onClick={closeImageModal}
					>
						<div className="relative " onClick={e => e.stopPropagation()}>
							<button
								className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-3"
								onClick={closeImageModal}
							>
								<X className="w-6 h-6" />
							</button>

							{selectedImage.relation.photos.length > 1 && (
								<>
									<button
										className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-3"
										onClick={prevModalImage}
									>
										<ChevronLeft className="w-6 h-6" />
									</button>
									<button
										className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-3"
										onClick={nextModalImage}
									>
										<ChevronRight className="w-6 h-6" />
									</button>
								</>
							)}

							<motion.img
								key={selectedImage.imageIndex}
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.8, opacity: 0 }}
								src={selectedImage.relation.photos[selectedImage.imageIndex]?.startsWith('http') 
									? selectedImage.relation.photos[selectedImage.imageIndex] 
									: `${BASE_URL}${selectedImage.relation.photos[selectedImage.imageIndex]}`
								}
								alt={selectedImage.relation.title}
								className="max-w-full max-h-[80vh] object-contain rounded-lg mx-auto"
							/>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<div className="container mx-auto px-6">
				{/* Sarlavha */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-16"
				>
					<h1 className="text-4xl font-bold text-gray-800 mb-4">{t.title}</h1>
					<div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
				</motion.div>

				{relations.length === 0 ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center text-gray-500 text-lg py-20"
					>
						{t.noData}
					</motion.div>
				) : (
					<div className="mx-auto space-y-12">
						{relations.map((item, index) => (
							<motion.div
								key={item.id}
								initial={{ opacity: 0, y: 30 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
							>
								{/* Rasmlar qismi */}
								<div className="p-6">
									<div className="grid grid-cols-3 gap-4 mb-6">
										{item.photos.slice(0, 3).map((photo, photoIndex) => (
											<div
												key={photoIndex}
												className={`${
													photoIndex === 0 ? 'col-span-2 row-span-2' : ''
												} rounded-xl overflow-hidden cursor-pointer`}
												onClick={() => openImageModal(item, photoIndex)}
											>
												<img
													src={photo?.startsWith('http') ? photo : `${BASE_URL}${photo}`}
													alt={`${item.title} ${photoIndex + 1}`}
													className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
												/>
											</div>
										))}
									</div>

									{item.photos.length > 3 && (
										<button
											onClick={() => openImageModal(item)}
											className="text-blue-600 hover:text-blue-700 font-medium text-sm mb-4"
										>
											+ {item.photos.length - 3} {t.viewAll}
										</button>
									)}
								</div>

								{/* Ma'lumotlar qismi */}
								<div className="px-6 pb-6">
									<div className="flex items-center gap-4 mb-4">
										<div className="flex items-center gap-2 text-blue-600">
											<Globe className="w-5 h-5" />
											<span className="font-semibold">Xalqaro loyiha</span>
										</div>
										<div className="flex items-center gap-2 text-gray-500 text-sm">
											<Calendar className="w-4 h-4" />
											<span>{item.date}</span>
										</div>
									</div>

									<h2 className="text-xl font-bold text-gray-800 mb-3">
										{item.title}
									</h2>

									<p className="text-gray-600 leading-relaxed">
										{expanded[item.id]
											? item.description
											: `${item.description?.slice(0, 120)}...`}
										{item.description?.length > 120 && (
											<button
												onClick={() => toggleExpand(item.id)}
												className="ml-2 text-blue-600 font-medium hover:text-blue-700"
											>
												{expanded[item.id] ? t.less : t.more}
											</button>
										)}
									</p>
								</div>
							</motion.div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default InternationalRelations