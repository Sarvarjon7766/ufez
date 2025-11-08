import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"

const PublicServices = () => {
	const [services, setServices] = useState([])
	const [loading, setLoading] = useState(true)
	const [expandedId, setExpandedId] = useState(null)
	const [language, setLanguage] = useState("uz")

	const BASE_URL = import.meta.env.VITE_BASE_URL

	// LocalStorage'dan tilni o'qish va komponent yuklanganda API dan ma'lumot olish
	useEffect(() => {
		const savedLang = localStorage.getItem("lang") || "uz"
		setLanguage(savedLang)

		// Komponent yuklanganda ma'lumotlarni olish
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

	// Tarjima matnlari - faqat taglar
	const translations = {
		uz: {
			title: "Davlat xizmatlari ro'yxati",
			loading: "Yuklanmoqda...",
			serviceNumber: "#",
			serviceName: "Xizmat nomi"
		},
		ru: {
			title: "Перечень государственных услуг",
			loading: "Загрузка...",
			serviceNumber: "#",
			serviceName: "Название услуги"
		},
		en: {
			title: "List of Public Services",
			loading: "Loading...",
			serviceNumber: "#",
			serviceName: "Service Name"
		}
	}

	const t = translations[language] || translations.uz

	// API dan ma'lumot olish funksiyasi
	const fetchServices = async (lang = language) => {
		try {
			setLoading(true)
			const res = await axios.get(`${BASE_URL}/api/service/getAll/${lang}`)
			if (res.data.success) {
				setServices(res.data.services)
			}
		} catch (error) {
			console.error("Xizmatlarni olishda xatolik:", error)
		} finally {
			setLoading(false)
		}
	}

	const toggleExpand = (id) => {
		setExpandedId(expandedId === id ? null : id)
	}

	if (loading) {
		return (
			<div className="flex justify-center items-center py-20">
				<div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
				<span className="ml-3 text-gray-600">{t.loading}</span>
			</div>
		)
	}

	return (
		<div className="min-h-screen py-12  to-blue-50">
			<div className="container mx-auto px-6">
				<motion.h1
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-4xl font-extrabold mb-10 text-center text-gray-800 tracking-tight"
				>
					{t.title}
				</motion.h1>

				{/* 🖥 Desktop Table */}
				<div className="hidden md:block overflow-x-auto">
					<table className="min-w-full bg-white rounded-2xl shadow-lg">
						<thead>
							<tr className="bg-blue-100 text-left">
								<th className="py-3 px-6 text-gray-700 w-20">{t.serviceNumber}</th>
								<th className="py-3 px-6 text-gray-700">{t.serviceName}</th>
							</tr>
						</thead>
						<tbody>
							{services.map((service, index) => (
								<>
									<tr
										key={service._id}
										className="border-b border-gray-200 hover:bg-blue-50 transition-all duration-300 cursor-pointer"
										onClick={() => toggleExpand(service._id)}
									>
										<td className="py-3 px-6 font-bold text-blue-600">{index + 1}</td>
										<td className="py-3 px-6 font-medium text-gray-800">{service.title}</td>
									</tr>

									<AnimatePresence>
										{expandedId === service._id && (
											<motion.tr
												initial={{ opacity: 0, y: -10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -10 }}
												transition={{ duration: 0.3 }}
											>
												<td colSpan="2" className="bg-blue-50 px-6 py-4 text-gray-700">
													{service.description}
												</td>
											</motion.tr>
										)}
									</AnimatePresence>
								</>
							))}
						</tbody>
					</table>
				</div>

				{/* 📱 Mobile Cards */}
				<div className="md:hidden grid grid-cols-1 gap-6">
					{services.map((service, index) => (
						<motion.div
							key={service._id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: index * 0.05 }}
							className="bg-white rounded-3xl shadow-md p-5 hover:shadow-xl transition-all duration-300 cursor-pointer"
							onClick={() => toggleExpand(service._id)}
						>
							<div className="flex items-start gap-4">
								<div className="text-blue-600 font-bold text-lg mt-1">{index + 1}.</div>
								<div className="text-gray-800 font-medium">{service.title}</div>
							</div>

							<AnimatePresence>
								{expandedId === service._id && (
									<motion.p
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										exit={{ opacity: 0, height: 0 }}
										transition={{ duration: 0.3 }}
										className="text-gray-700 mt-3"
									>
										{service.description}
									</motion.p>
								)}
							</AnimatePresence>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	)
}

export default PublicServices