import axios from 'axios'
import { motion } from 'framer-motion'
import { FileText, Search } from 'lucide-react'
import { useEffect, useState } from 'react'

const EGovernment = () => {
	const [services, setServices] = useState([])
	const [filteredServices, setFilteredServices] = useState([])
	const [loading, setLoading] = useState(true)
	const [language, setLanguage] = useState("uz")
	const [searchTerm, setSearchTerm] = useState("")
	const BASE_URL = import.meta.env.VITE_BASE_URL

	// Tarjima matnlari
	const translations = {
		uz: {
			title: "Elektron Hukumat",
			loading: "Yuklanmoqda...",
			noData: "Elektron hukumat xizmatlari hozircha mavjud emas.",
			servicesList: "Elektron hukumat xizmatlari ro'yxati",
			searchPlaceholder: "Xizmatlarni qidirish...",
			noResults: "Hech narsa topilmadi",
			foundResults: "ta natija topildi"
		},
		ru: {
			title: "Электронное правительство",
			loading: "Загрузка...",
			noData: "Услуги электронного правительства пока недоступны.",
			servicesList: "Список услуг электронного правительства",
			searchPlaceholder: "Поиск услуг...",
			noResults: "Ничего не найдено",
			foundResults: "результатов найдено"
		},
		en: {
			title: "E-Government",
			loading: "Loading...",
			noData: "E-government services are not available yet.",
			servicesList: "List of E-Government Services",
			searchPlaceholder: "Search services...",
			noResults: "No results found",
			foundResults: "results found"
		}
	}

	const t = translations[language] || translations.uz

	useEffect(() => {
		const savedLang = localStorage.getItem("lang") || "uz"
		setLanguage(savedLang)
		fetchServices(savedLang)
	}, [])

	// Til o'zgarganda yangilash
	useEffect(() => {
		const handleStorageChange = () => {
			const savedLang = localStorage.getItem("lang") || "uz"
			if (savedLang !== language) {
				setLanguage(savedLang)
				fetchServices(savedLang)
			}
		}

		window.addEventListener('storage', handleStorageChange)
		const interval = setInterval(() => {
			const savedLang = localStorage.getItem("lang") || "uz"
			if (savedLang !== language) {
				setLanguage(savedLang)
				fetchServices(savedLang)
			}
		}, 1000)

		return () => {
			window.removeEventListener('storage', handleStorageChange)
			clearInterval(interval)
		}
	}, [language])

	// Search filter
	useEffect(() => {
		if (searchTerm.trim() === '') {
			setFilteredServices(services)
		} else {
			const filtered = services.filter(service =>
				service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				service.url.toLowerCase().includes(searchTerm.toLowerCase())
			)
			setFilteredServices(filtered)
		}
	}, [searchTerm, services])

	const fetchServices = async (lang = language) => {
		try {
			setLoading(true)
			const res = await axios.get(`${BASE_URL}/api/egovernment/getAll/${lang}`)
			if (res.data.success && res.data.egovernments.length > 0) {
				setServices(res.data.egovernments)
				setFilteredServices(res.data.egovernments)
			}
		} catch (error) {
			console.error("Elektron hukumat xizmatlarini olishda xatolik:", error)
			// Example data
			const exampleData = [
				{
					id: 1,
					title: "Davlat xizmatlari portali",
					url: "https://my.gov.uz"
				},
				{
					id: 2,
					title: "Soliq xizmatlari",
					url: "https://soliq.uz"
				},
				{
					id: 3,
					title: "Notarial xizmatlar",
					url: "https://notariat.uz"
				},
				{
					id: 4,
					title: "Kadastr xizmatlari",
					url: "https://kadastr.uz"
				},
				{
					id: 5,
					title: "Ichki ishlar vazirligi xizmatlari",
					url: "https://iiv.uz"
				},
				{
					id: 6,
					title: "Adliya xizmatlari",
					url: "https://adliya.uz"
				}
			]
			setServices(exampleData)
			setFilteredServices(exampleData)
		} finally {
			setLoading(false)
		}
	}

	const handleOpenService = (url) => {
		window.open(url, '_blank')
	}

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value)
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

	if (!services || services.length === 0) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
				<div className="text-center max-w-md">
					<FileText className="w-14 h-14 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
					<h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-3 md:mb-4">{t.title}</h2>
					<p className="text-gray-500 text-sm md:text-base">{t.noData}</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-6 md:py-8">
			<div className="container mx-auto px-4 max-w-5xl xl:max-w-6xl">
				{/* Header Section */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-8 md:mb-12"
				>
					<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
						{t.title}
					</h1>
				</motion.div>

				{/* Search Section */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="mb-6 md:mb-8"
				>
					<div className="relative max-w-2xl mx-auto">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
						<input
							type="text"
							value={searchTerm}
							onChange={handleSearchChange}
							placeholder={t.searchPlaceholder}
							className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
						/>
					</div>
				</motion.div>

				{/* Results Info */}
				{searchTerm && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center mb-4"
					>
						<p className="text-gray-600 text-sm md:text-base">
							{filteredServices.length} {t.foundResults}
							{searchTerm && (
								<span className="text-gray-400 ml-2">
									"{searchTerm}" bo'yicha
								</span>
							)}
						</p>
					</motion.div>
				)}

				{/* Services List */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="bg-white rounded-xl md:rounded-2xl shadow-sm overflow-hidden"
				>
					<div className="p-4 md:p-6">
						{/* No Results Message */}
						{filteredServices.length === 0 && searchTerm ? (
							<div className="text-center py-8">
								<Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
								<h3 className="text-lg font-medium text-gray-900 mb-2">{t.noResults}</h3>
								<p className="text-gray-500 text-sm">
									"{searchTerm}" so'rovi bo'yicha hech narsa topilmadi
								</p>
							</div>
						) : (
							/* Services List */
							<div className="space-y-2 md:space-y-3">
								{filteredServices.map((service, index) => (
									<motion.div
										key={service.id}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: index * 0.05 }}
										onClick={() => handleOpenService(service.url)}
										className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg hover:bg-blue-50 cursor-pointer transition-all duration-200 group"
									>
										{/* Number */}
										<div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs md:text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
											{services.findIndex(s => s.id === service.id) + 1}
										</div>

										{/* Service Title */}
										<div className="flex-1 min-w-0">
											<h3 className="text-base md:text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
												{service.title}
											</h3>
											{searchTerm && (
												<p className="text-xs text-gray-500 mt-1 truncate">
													{service.url}
												</p>
											)}
										</div>
									</motion.div>
								))}
							</div>
						)}
					</div>
				</motion.div>
			</div>
		</div>
	)
}

export default EGovernment