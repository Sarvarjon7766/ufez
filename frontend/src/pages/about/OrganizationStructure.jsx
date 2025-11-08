import axios from 'axios'
import { motion } from 'framer-motion'
import { Image } from 'lucide-react'
import { useEffect, useState } from 'react'

const OrganizationStructure = () => {
	const [structures, setStructures] = useState([])
	const [loading, setLoading] = useState(true)
	const [language, setLanguage] = useState("uz")
	const BASE_URL = import.meta.env.VITE_BASE_URL

	// Tarjima matnlari
	const translations = {
		uz: {
			title: "Tashkiliy Tuzilma",
			loading: "Yuklanmoqda...",
			noData: "Tashkiliy tuzilma ma'lumotlari hozircha mavjud emas.",
			organizationalStructure: "Tashkiliy tuzilma"
		},
		ru: {
			title: "Организационная структура",
			loading: "Загрузка...",
			noData: "Информация об организационной структуре пока недоступна.",
			organizationalStructure: "Организационная структура"
		},
		en: {
			title: "Organizational Structure",
			loading: "Loading...",
			noData: "Organizational structure information is not available yet.",
			organizationalStructure: "Organizational Structure"
		}
	}

	const t = translations[language] || translations.uz

	useEffect(() => {
		const savedLang = localStorage.getItem("lang") || "uz"
		setLanguage(savedLang)
		fetchStructures(savedLang)
	}, [])

	// Til o'zgarganda yangilash
	useEffect(() => {
		const handleStorageChange = () => {
			const savedLang = localStorage.getItem("lang") || "uz"
			if (savedLang !== language) {
				setLanguage(savedLang)
				fetchStructures(savedLang)
			}
		}

		window.addEventListener('storage', handleStorageChange)
		const interval = setInterval(() => {
			const savedLang = localStorage.getItem("lang") || "uz"
			if (savedLang !== language) {
				setLanguage(savedLang)
				fetchStructures(savedLang)
			}
		}, 1000)

		return () => {
			window.removeEventListener('storage', handleStorageChange)
			clearInterval(interval)
		}
	}, [language])

	const fetchStructures = async (lang = language) => {
		try {
			setLoading(true)
			const res = await axios.get(`${BASE_URL}/api/structure/getAll`)
			if (res.data.success && res.data.structures.length > 0) {
				setStructures(res.data.structures)
			}
		} catch (error) {
			console.error("Tashkiliy tuzilma ma'lumotlarini olishda xatolik:", error)
			// Example data
			setStructures([
				{
					id: 1,
					title: "Boshqaruv tuzilmasi",
					photo: "/uploads/structures/structure1.jpg",
					file: "/uploads/files/structure1.pdf"
				},
				{
					id: 2,
					title: "Bo'limlar tuzilmasi",
					photo: "/uploads/structures/structure2.jpg",
					file: "/uploads/files/structure2.pdf"
				},
				{
					id: 3,
					title: "Hodimlar tarkibi",
					photo: "/uploads/structures/structure3.jpg",
					file: "/uploads/files/structure3.docx"
				},
				{
					id: 4,
					title: "Funksional bog'liqlik",
					photo: "/uploads/structures/structure4.png",
					file: "/uploads/files/structure4.pdf"
				}
			])
		} finally {
			setLoading(false)
		}
	}

	// URL ni to'g'ri shaklda olish
	const getFullUrl = (url) => {
		if (!url) return null
		if (url.startsWith('http')) {
			return url
		}
		return `${BASE_URL}${url}`
	}

	const handleOpenFile = (fileUrl) => {
		const fullUrl = getFullUrl(fileUrl)
		window.open(fullUrl, '_blank')
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600 text-base md:text-lg">{t.loading}</p>
				</div>
			</div>
		)
	}

	if (!structures || structures.length === 0) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
				<div className="text-center max-w-md">
					<Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
					<h2 className="text-2xl font-bold text-gray-700 mb-4">{t.title}</h2>
					<p className="text-gray-500 text-lg">{t.noData}</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
			<div className="container mx-auto px-4 max-w-6xl">
				{/* Header Section */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-12"
				>
					<h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
						{t.title}
					</h1>
				</motion.div>

				{/* Single Column Layout */}
				<div className="space-y-8">
					{structures.map((structure, index) => {
						const fullPhotoUrl = getFullUrl(structure.photo)

						return (
							<motion.div
								key={structure.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
							>
							

								{/* Large Image */}
								<div
									className="cursor-pointer group"
									onClick={() => handleOpenFile(structure.file)}
								>
									<img
										src={fullPhotoUrl}
										alt={structure.title}
										className="w-full h-auto max-h-[70vh] object-contain group-hover:opacity-90 transition-opacity duration-300"
										onError={(e) => {
											e.target.src = 'https://via.placeholder.com/1200x800?text=Rasm+Yuklanmadi'
										}}
									/>
								</div>
							</motion.div>
						)
					})}
				</div>
			</div>
		</div>
	)
}

export default OrganizationStructure