import axios from 'axios'
import { motion } from 'framer-motion'
import { Briefcase, Phone, User } from 'lucide-react'
import { useEffect, useState } from 'react'

const Employer = () => {
	const [employers, setEmployers] = useState([])
	const [loading, setLoading] = useState(true)
	const [language, setLanguage] = useState("ru")
	const BASE_URL = import.meta.env.VITE_BASE_URL

	// Tarjima matnlari
	const translations = {
		uz: {
			title: "Rahbariyat",
			loading: "Yuklanmoqda...",
			noData: "Xodimlar ma'lumotlari hozircha mavjud emas.",
			fullName: "FISH",
			position: "Lavozim",
			phone: "Telefon",
			staff: "Xodimlar tarkibi"
		},
		ru: {
			title: "Руководство",
			loading: "Загрузка...",
			noData: "Информация о сотрудниках пока недоступна.",
			fullName: "ФИО",
			position: "Должность",
			phone: "Телефон",
			staff: "Состав сотрудников"
		},
		en: {
			title: "Management",
			loading: "Loading...",
			noData: "Employee information is not available yet.",
			fullName: "Full Name",
			position: "Position",
			phone: "Phone",
			staff: "Staff Members"
		}
	}

	const t = translations[language] || translations.ru

	useEffect(() => {
		const savedLang = localStorage.getItem("lang") || "ru"
		setLanguage(savedLang)
		fetchEmployers(savedLang)
	}, [])

	// Til o'zgarganda yangilash
	useEffect(() => {
		const handleStorageChange = () => {
			const savedLang = localStorage.getItem("lang") || "ru"
			if (savedLang !== language) {
				setLanguage(savedLang)
				fetchEmployers(savedLang)
			}
		}

		window.addEventListener('storage', handleStorageChange)
		const interval = setInterval(() => {
			const savedLang = localStorage.getItem("lang") || "ru"
			if (savedLang !== language) {
				setLanguage(savedLang)
				fetchEmployers(savedLang)
			}
		}, 1000)

		return () => {
			window.removeEventListener('storage', handleStorageChange)
			clearInterval(interval)
		}
	}, [language])

	const fetchEmployers = async (lang = language) => {
		try {
			setLoading(true)
			const res = await axios.get(`${BASE_URL}/api/employer/getAll/${lang}`)
			if (res.data.success && res.data.employers.length > 0) {
				setEmployers(res.data.employers)
			}
		} catch (error) {
			console.error("Xodimlar ma'lumotlarini olishda xatolik:", error)
			// Example data with multiple languages
			const exampleData = {
				uz: [
					{
						id: 1,
						fullName: "Alisher Usmonov",
						position: "Direktor",
						phone: "+998 90 123 45 67"
					},
					{
						id: 2,
						fullName: "Madina Hasanova",
						position: "Direktor o'rinbosari",
						phone: "+998 91 234 56 78"
					},
					{
						id: 3,
						fullName: "Ravshan Ibrohimov",
						position: "Bo'lim boshlig'i",
						phone: "+998 93 345 67 89"
					},
					{
						id: 4,
						fullName: "Dilshod Rahimov",
						position: "Bosh mutaxassis",
						phone: "+998 94 456 78 90"
					}
				],
				ru: [
					{
						id: 1,
						fullName: "Алишер Усманов",
						position: "Директор",
						phone: "+998 90 123 45 67"
					},
					{
						id: 2,
						fullName: "Мадина Хасанова",
						position: "Заместитель директора",
						phone: "+998 91 234 56 78"
					},
					{
						id: 3,
						fullName: "Равшан Ибрагимов",
						position: "Начальник отдела",
						phone: "+998 93 345 67 89"
					},
					{
						id: 4,
						fullName: "Дилшод Рахимов",
						position: "Главный специалист",
						phone: "+998 94 456 78 90"
					}
				],
				en: [
					{
						id: 1,
						fullName: "Alisher Usmanov",
						position: "Director",
						phone: "+998 90 123 45 67"
					},
					{
						id: 2,
						fullName: "Madina Khasanova",
						position: "Deputy Director",
						phone: "+998 91 234 56 78"
					},
					{
						id: 3,
						fullName: "Ravshan Ibragimov",
						position: "Department Head",
						phone: "+998 93 345 67 89"
					},
					{
						id: 4,
						fullName: "Dilshod Rakhimov",
						position: "Chief Specialist",
						phone: "+998 94 456 78 90"
					}
				]
			}
			setEmployers(exampleData[lang] || exampleData.ru)
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

	if (!employers || employers.length === 0) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
				<div className="text-center max-w-md">
					<User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
					<h2 className="text-2xl font-bold text-gray-700 mb-4">{t.title}</h2>
					<p className="text-gray-500 text-lg">{t.noData}</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
			<div className="w-full px-4 sm:px-6 lg:px-8">
				{/* Header Section */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-8"
				>
					<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
						{t.title}
					</h1>
				</motion.div>

				{/* Desktop Table */}
				<div className="hidden lg:block bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
					{/* Table Header */}
					<div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
						<div className="grid grid-cols-12 gap-4 text-white font-semibold">
							<div className="col-span-1 text-center">№</div>
							<div className="col-span-5">{t.fullName}</div>
							<div className="col-span-4">{t.position}</div>
							<div className="col-span-2">{t.phone}</div>
						</div>
					</div>

					{/* Table Body */}
					<div className="divide-y divide-gray-100">
						{employers.map((employer, index) => (
							<motion.div
								key={employer.id}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.1 }}
								className="px-6 py-4 hover:bg-blue-50 transition-colors duration-200"
							>
								<div className="grid grid-cols-12 gap-4 items-center">
									{/* Number */}
									<div className="col-span-1">
										<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
											<span className="text-blue-600 font-semibold text-sm">
												{index + 1}
											</span>
										</div>
									</div>

									{/* Full Name */}
									<div className="col-span-5">
										<div className="flex items-center gap-3">
											<div>
												<h3 className="font-semibold text-gray-900 text-base lg:text-lg">
													{employer.fullName}
												</h3>
											</div>
										</div>
									</div>

									{/* Position */}
									<div className="col-span-4">
										<div className="flex items-center gap-2">
											<span className="text-gray-900 font-medium text-sm lg:text-base">
												{employer.position}
											</span>
										</div>
									</div>

									{/* Phone */}
									<div className="col-span-2">
										{employer.phone && (
											<div className="flex items-center gap-2">
												<Phone className="w-4 h-4 text-green-600 flex-shrink-0" />
												<span className="text-gray-900 font-medium text-sm lg:text-base">
													{employer.phone}
												</span>
											</div>
										)}
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</div>

				{/* Tablet View */}
				<div className="hidden md:block lg:hidden">
					<div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
						{/* Table Header */}
						<div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
							<div className="grid grid-cols-8 gap-3 text-white font-semibold text-sm">
								<div className="col-span-1 text-center">№</div>
								<div className="col-span-3">{t.fullName}</div>
								<div className="col-span-2">{t.position}</div>
								<div className="col-span-2">{t.phone}</div>
							</div>
						</div>

						{/* Table Body */}
						<div className="divide-y divide-gray-100">
							{employers.map((employer, index) => (
								<motion.div
									key={employer.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.1 }}
									className="px-4 py-3 hover:bg-blue-50 transition-colors duration-200"
								>
									<div className="grid grid-cols-8 gap-3 items-center">
										{/* Number */}
										<div className="col-span-1">
											<div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
												<span className="text-blue-600 font-semibold text-xs">
													{index + 1}
												</span>
											</div>
										</div>

										{/* Full Name */}
										<div className="col-span-3">
											<div className="flex items-center gap-2">
												<div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
													<User className="w-4 h-4 text-white" />
												</div>
												<div className="min-w-0">
													<h3 className="font-semibold text-gray-900 text-sm truncate">
														{employer.fullName}
													</h3>
												</div>
											</div>
										</div>

										{/* Position */}
										<div className="col-span-2">
											<div className="flex items-center gap-1">
												<Briefcase className="w-3 h-3 text-gray-600 flex-shrink-0" />
												<span className="text-gray-900 font-medium text-xs truncate">
													{employer.position}
												</span>
											</div>
										</div>

										{/* Phone */}
										<div className="col-span-2">
											{employer.phone && (
												<div className="flex items-center gap-1">
													<Phone className="w-3 h-3 text-green-600 flex-shrink-0" />
													<span className="text-gray-900 font-medium text-xs truncate">
														{employer.phone}
													</span>
												</div>
											)}
										</div>
									</div>
								</motion.div>
							))}
						</div>
					</div>
				</div>

				<div className="md:hidden space-y-4">
					{employers.map((employer, index) => (
						<motion.div
							key={employer.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							className="bg-white rounded-lg shadow-md border border-gray-200 p-4"
						>
							<div className="flex items-start justify-between mb-3">
								<div className="flex items-center gap-3 flex-1">
									<div className="flex-1 min-w-0">
										<h3 className="font-bold text-gray-900 text-base truncate">
											{employer.fullName}
										</h3>
										<div className="flex items-center gap-1 mt-1">
											<span className="text-gray-600 text-xs truncate">
												{employer.position}
											</span>
										</div>
									</div>
								</div>
								<div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
									<span className="text-blue-600 font-semibold text-xs">
										{index + 1}
									</span>
								</div>
							</div>

							{employer.phone && (
								<div className="flex items-center gap-2 pt-3 border-t border-gray-100">
									<Phone className="w-4 h-4 text-green-600 flex-shrink-0" />
									<div className="min-w-0 flex-1">
										<p className="text-gray-600 text-xs">{t.phone}</p>
										<p className="text-gray-900 font-medium text-sm truncate">
											{employer.phone}
										</p>
									</div>
								</div>
							)}
						</motion.div>
					))}
				</div>
			</div>
		</div>
	)
}

export default Employer