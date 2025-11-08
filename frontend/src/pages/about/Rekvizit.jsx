import axios from 'axios'
import { motion } from 'framer-motion'
import { Building, Globe, MapPin, Phone } from 'lucide-react'
import { useEffect, useState } from 'react'

const Rekvizit = () => {
	const [rekvizits, setRekvizits] = useState([])
	const [loading, setLoading] = useState(true)
	const [language, setLanguage] = useState("uz")
	const BASE_URL = import.meta.env.VITE_BASE_URL

	// Tarjima matnlari
	const translations = {
		uz: {
			title: "Rekvizitlar",
			loading: "Yuklanmoqda...",
			noData: "Rekvizit ma'lumotlari hozircha mavjud emas.",
			contactInfo: "Aloqa ma'lumotlari",
			phone: "Telefon",
			fax: "Faks",
			address: "Manzil",
			website: "Veb-sayt",
			details: "Tafsilot"
		},
		ru: {
			title: "Реквизиты",
			loading: "Загрузка...",
			noData: "Информация о реквизитах пока недоступна.",
			contactInfo: "Контактная информация",
			phone: "Телефон",
			fax: "Факс",
			address: "Адрес",
			website: "Веб-сайт",
			details: "Подробности"
		},
		en: {
			title: "Requisites",
			loading: "Loading...",
			noData: "Requisite information is not available yet.",
			contactInfo: "Contact Information",
			phone: "Phone",
			fax: "Fax",
			address: "Address",
			website: "Website",
			details: "Details"
		}
	}

	const t = translations[language] || translations.uz

	useEffect(() => {
		const savedLang = localStorage.getItem("lang") || "uz"
		setLanguage(savedLang)
		fetchRekvizits(savedLang)
	}, [])

	// Til o'zgarganda yangilash
	useEffect(() => {
		const handleStorageChange = () => {
			const savedLang = localStorage.getItem("lang") || "uz"
			if (savedLang !== language) {
				setLanguage(savedLang)
				fetchRekvizits(savedLang)
			}
		}

		window.addEventListener('storage', handleStorageChange)
		const interval = setInterval(() => {
			const savedLang = localStorage.getItem("lang") || "uz"
			if (savedLang !== language) {
				setLanguage(savedLang)
				fetchRekvizits(savedLang)
			}
		}, 1000)

		return () => {
			window.removeEventListener('storage', handleStorageChange)
			clearInterval(interval)
		}
	}, [language])

	const fetchRekvizits = async (lang = language) => {
		try {
			setLoading(true)
			const res = await axios.get(`${BASE_URL}/api/rekvizit/getAll/${lang}`)
			if (res.data.success && res.data.rekvizits.length > 0) {
				setRekvizits(res.data.rekvizits)
			}
		} catch (error) {
			console.error("Rekvizit ma'lumotlarini olishda xatolik:", error)
			// Example data
			setRekvizits([
				{
					id: 1,
					title: "Bosh ofis",
					description: "Urgut EIZ asosiy boshqaruv binosi",
					faks_number: "+998 78 123 45 67",
					phone_number: "+998 78 123 45 68",
					address: "Urgut tumani, Samarqand viloyati, O'zbekiston",
					website: "www.urguteiz.uz"
				},
				{
					id: 2,
					title: "Investitsiya bo'limi",
					description: "Investitsiya loyihalari va hamkorlik bo'limi",
					faks_number: "+998 78 123 45 69",
					phone_number: "+998 78 123 45 70",
					address: "Urgut tumani, Sanoat zonasi, 1-bino",
					website: "www.urguteiz.uz/invest"
				}
			])
		} finally {
			setLoading(false)
		}
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

	if (!rekvizits || rekvizits.length === 0) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
				<div className="text-center max-w-md">
					<Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
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
					className="text-center mb-8"
				>
					<h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
						{t.title}
					</h1>
				</motion.div>

				{/* Rekvizits Table-like Layout */}
				<div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
					{/* Table Header */}
					<div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
						<div className="grid grid-cols-12 gap-4 text-white font-semibold">
							<div className="col-span-3">{t.address}</div>
							<div className="col-span-2">{t.phone}</div>
							<div className="col-span-2">{t.fax}</div>
							<div className="col-span-3">{t.details}</div>
						</div>
					</div>

					{/* Table Body */}
					<div className="divide-y divide-gray-100">
						{rekvizits.map((rekvizit, index) => (
							<motion.div
								key={rekvizit.id}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.1 }}
								className="px-6 py-4 hover:bg-blue-50 transition-colors duration-200"
							>
								<div className="grid grid-cols-12 gap-4 items-center">
									{/* Address */}
									<div className="col-span-3">
										<div className="flex items-start gap-2">
											<MapPin className="w-4 h-4 text-orange-600 flex-shrink-0 mt-1" />
											<div>
												<h3 className="font-semibold text-gray-900 text-lg">
													{rekvizit.title}
												</h3>
												{rekvizit.address && (
													<p className="text-gray-600 text-sm mt-1">
														{rekvizit.address}
													</p>
												)}
											</div>
										</div>
									</div>

									{/* Phone Number */}
									<div className="col-span-2">
										{rekvizit.phone_number && (
											<div className="flex items-center gap-2">
												<Phone className="w-4 h-4 text-green-600 flex-shrink-0" />
												<span className="text-gray-900 font-medium">
													{rekvizit.phone_number}
												</span>
											</div>
										)}
									</div>

									{/* Fax Number */}
									<div className="col-span-2">
										{rekvizit.faks_number && (
											<div className="flex items-center gap-2">
												<Phone className="w-4 h-4 text-purple-600 flex-shrink-0" />
												<span className="text-gray-900 font-medium">
													{rekvizit.faks_number}
												</span>
											</div>
										)}
									</div>

									{/* Description (Tafsilot) */}
									<div className="col-span-3">
										{rekvizit.description && (
											<p className="text-gray-900">
												{rekvizit.description}
											</p>
										)}
									</div>

									{/* Website */}
									<div className="col-span-2">
										{rekvizit.website && (
											<div className="flex items-center gap-2">
												<Globe className="w-4 h-4 text-blue-600 flex-shrink-0" />
												<span className="text-gray-900 text-sm">
													{rekvizit.website}
												</span>
											</div>
										)}
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</div>

				{/* Mobile View - Cards for smaller screens */}
				<div className="mt-8 md:hidden">
					{rekvizits.map((rekvizit, index) => (
						<motion.div
							key={rekvizit.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-4"
						>
							<div className="flex items-start gap-2 mb-3">
								<MapPin className="w-5 h-5 text-orange-600 mt-1" />
								<div>
									<h3 className="font-bold text-gray-900 text-lg">{rekvizit.title}</h3>
									{rekvizit.address && (
										<p className="text-gray-600 text-sm">{rekvizit.address}</p>
									)}
								</div>
							</div>

							<div className="space-y-3">
								{rekvizit.phone_number && (
									<div className="flex items-center gap-2">
										<Phone className="w-4 h-4 text-green-600" />
										<div>
											<p className="text-gray-600 text-sm">{t.phone}</p>
											<p className="text-gray-900 font-medium">{rekvizit.phone_number}</p>
										</div>
									</div>
								)}

								{rekvizit.faks_number && (
									<div className="flex items-center gap-2">
										<Phone className="w-4 h-4 text-purple-600" />
										<div>
											<p className="text-gray-600 text-sm">{t.fax}</p>
											<p className="text-gray-900 font-medium">{rekvizit.faks_number}</p>
										</div>
									</div>
								)}

								{rekvizit.description && (
									<div>
										<p className="text-gray-600 text-sm">{t.details}:</p>
										<p className="text-gray-900">{rekvizit.description}</p>
									</div>
								)}
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	)
}

export default Rekvizit