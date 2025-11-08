import axios from 'axios'
import { motion } from "framer-motion"
import { ExternalLink, FileText, User } from "lucide-react"
import { useEffect, useState } from 'react'

const CharterEIZ = () => {
	const [charter, setCharter] = useState(null)
	const [loading, setLoading] = useState(true)
	const [language, setLanguage] = useState("uz")
	const BASE_URL = import.meta.env.VITE_BASE_URL

	// Tarjima matnlari
	const translations = {
		uz: {
			title: "Urgut EIZ Nizomi",
			loading: "Yuklanmoqda...",
			viewFile: "Nizomni ko'rish",
			lastUpdated: "Oxirgi yangilangan",
			signatory: "Imzolovchi",
			noData: "Nizom ma'lumotlari hozircha mavjud emas.",
			charterContent: "Nizom matni"
		},
		ru: {
			title: "Устав Ургутской ОЭЗ",
			loading: "Загрузка...",
			viewFile: "Посмотреть устав",
			lastUpdated: "Последнее обновление",
			signatory: "Подписант",
			noData: "Информация об уставе пока недоступна.",
			charterContent: "Текст устава"
		},
		en: {
			title: "Urgut FEZ Charter",
			loading: "Loading...",
			viewFile: "View Charter",
			lastUpdated: "Last updated",
			signatory: "Signatory",
			noData: "Charter information is not available yet.",
			charterContent: "Charter Content"
		}
	}

	const t = translations[language] || translations.uz

	useEffect(() => {
		const savedLang = localStorage.getItem("lang") || "uz"
		setLanguage(savedLang)
		fetchCharter(savedLang)
	}, [])

	// Til o'zgarganda yangilash
	useEffect(() => {
		const handleStorageChange = () => {
			const savedLang = localStorage.getItem("lang") || "uz"
			if (savedLang !== language) {
				setLanguage(savedLang)
				fetchCharter(savedLang)
			}
		}

		window.addEventListener('storage', handleStorageChange)
		const interval = setInterval(() => {
			const savedLang = localStorage.getItem("lang") || "uz"
			if (savedLang !== language) {
				setLanguage(savedLang)
				fetchCharter(savedLang)
			}
		}, 1000)

		return () => {
			window.removeEventListener('storage', handleStorageChange)
			clearInterval(interval)
		}
	}, [language])

	const fetchCharter = async (lang = language) => {
		try {
			setLoading(true)
			const res = await axios.get(`${BASE_URL}/api/charter/getAll/${lang}`)
			if (res.data.success && res.data.charters.length > 0) {
				setCharter(res.data.charters[0])
			}
		} catch (error) {
			console.error("Nizom ma'lumotlarini olishda xatolik:", error)
			// Example data
			setCharter({
				id: 1,
				title: "Urgut erkin iqtisodiy zonasining Nizomi",
				description: `1-bob. Umumiy qoidalar
1.1. Ushbu Nizom Urgut erkin iqtisodiy zonasining faoliyatini tartibga soladi.
1.2. Zona O'zbekiston Respublikasi qonunlari asosida tashkil etilgan.

2-bob. Zonaning vazifalari
2.1. Iqtisodiyotning turli sohalarida investitsiya loyihalarini amalga oshirish.
2.2. Yangi ish o'rinlari yaratish.`,
				file: "http://localhost:5000/uploads/files/1762229929643-629391104.pdf",
				lastUpdated: "2024-12-01",
				signatory: "Egamberdiyev Sarvar - Urgut EIZ Direktori"
			})
		} finally {
			setLoading(false)
		}
	}

	const handleViewFile = () => {
		if (charter?.file) {
			const fileUrl = charter.file.startsWith('http')
				? charter.file
				: `${BASE_URL}${charter.file}`
			// Yangi oynada faylni ochish
			window.open(fileUrl, '_blank')
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600 text-lg font-medium">{t.loading}</p>
				</div>
			</div>
		)
	}

	if (!charter) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center max-w-md mx-auto px-6">
					<FileText className="w-20 h-20 text-gray-400 mx-auto mb-6" />
					<h2 className="text-2xl font-bold text-gray-700 mb-4">{t.title}</h2>
					<p className="text-gray-500 text-lg">{t.noData}</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen py-8">
			<div className="container mx-auto px-4 max-w-4xl">
				{/* Header Section */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-12"
				>
					<h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
						{t.title}
					</h1>
				</motion.div>

				{/* Main Content Card */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
				>
					{/* Action Bar */}
					<div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
						<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
							<div></div>
							{charter?.file && (
								<button
									onClick={handleViewFile}
									className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-200 font-semibold py-2.5 px-5 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md hover:border-blue-300"
								>
									<ExternalLink className="w-4 h-4" />
									{t.viewFile}
								</button>
							)}
						</div>
					</div>

					{/* Content */}
					<div className="p-6 md:p-8">
						{/* Document Title */}
						<div className="text-center mb-8">
							<h2 className="text-2xl font-bold text-gray-800 mb-2">
								{charter.title}
							</h2>
							<p className="text-gray-600">
								{t.charterContent}
							</p>
						</div>

						{/* Document Text */}
						<div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-h3:text-blue-700 prose-h3:font-semibold">
							{charter.description.split('\n').map((paragraph, index) => {
								if (paragraph.trim() === '') return null

								// Bob sarlavhalarini aniqlash
								if (paragraph.match(/^\d+-bob/)) {
									return (
										<h3 key={index} className="text-xl font-semibold text-blue-700 mt-8 mb-6 pb-3 border-b border-blue-100">
											{paragraph}
										</h3>
									)
								}

								// Bandlarni aniqlash
								if (paragraph.match(/^\d+\.\d+/)) {
									const parts = paragraph.split('. ')
									return (
										<div key={index} className="mb-5 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
											<p className="font-semibold text-gray-800 mb-2">
												{parts[0]}.
											</p>
											<p className="text-gray-700 leading-relaxed">
												{parts.slice(1).join('. ')}
											</p>
										</div>
									)
								}

								// Oddiy paragraflar
								return (
									<p key={index} className="text-gray-700 leading-relaxed mb-5">
										{paragraph}
									</p>
								)
							})}
						</div>

						{/* Signature Section */}
						{charter.signatory && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.3 }}
								className="mt-12 pt-8 border-t border-gray-200"
							>
								<div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6">
									<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
										<div className="flex items-center gap-4">
											<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
												<User className="w-6 h-6 text-blue-600" />
											</div>
											<div>
												<p className="text-sm text-gray-600 font-medium">{t.signatory}</p>
												<p className="font-bold text-gray-900">{charter.signatory}</p>
											</div>
										</div>
										<div className="text-center md:text-right">
											<p className="text-sm text-gray-600 font-medium">{t.lastUpdated}</p>
											<p className="font-bold text-gray-900">{charter.lastUpdated}</p>
										</div>
									</div>
								</div>
							</motion.div>
						)}
					</div>
				</motion.div>
			</div>
		</div>
	)
}

export default CharterEIZ