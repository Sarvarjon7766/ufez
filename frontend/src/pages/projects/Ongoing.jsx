import axios from 'axios'
import { useEffect, useState } from 'react'

const Ongoing = () => {
	const [projects, setProjects] = useState([])
	const [loading, setLoading] = useState(true)
	const [language, setLanguage] = useState("uz")
	const BASE_URL = import.meta.env.VITE_BASE_URL

	// Tarjima matnlari
	const translations = {
		uz: {
			title: "Amaldagi loyihalar",
			loading: "Loyihalar yuklanmoqda...",
			noData: "Davom etayotgan loyihalar hozircha mavjud emas.",
			companyName: "Kompaniya nomi",
			projectName: "Loyiha nomi",
			contact: "Aloqa",
			ongoingProjects: "Hozirda amalga oshirilayotgan loyihalar"
		},
		ru: {
			title: "Текущие Проекты",
			loading: "Проекты загружаются...",
			noData: "Текущие проекты пока недоступны.",
			companyName: "Название компании",
			projectName: "Название проекта",
			contact: "Контакт",
			ongoingProjects: "Проекты, находящиеся в стадии реализации"
		},
		en: {
			title: "Ongoing Projects",
			loading: "Loading projects...",
			noData: "No ongoing projects available yet.",
			companyName: "Company Name",
			projectName: "Project Name",
			contact: "Contact",
			ongoingProjects: "Projects Currently Under Implementation"
		}
	}

	const t = translations[language] || translations.uz

	useEffect(() => {
		const savedLang = localStorage.getItem("lang") || "uz"
		setLanguage(savedLang)
		fetchProjects(savedLang)
	}, [])

	// Til o'zgarganda yangilash
	useEffect(() => {
		const handleStorageChange = () => {
			const savedLang = localStorage.getItem("lang") || "uz"
			if (savedLang !== language) {
				setLanguage(savedLang)
				fetchProjects(savedLang)
			}
		}

		window.addEventListener('storage', handleStorageChange)
		const interval = setInterval(() => {
			const savedLang = localStorage.getItem("lang") || "uz"
			if (savedLang !== language) {
				setLanguage(savedLang)
				fetchProjects(savedLang)
			}
		}, 1000)

		return () => {
			window.removeEventListener('storage', handleStorageChange)
			clearInterval(interval)
		}
	}, [language])

	const fetchProjects = async (lang = language) => {
		try {
			setLoading(true)
			const res = await axios.get(`${BASE_URL}/api/project/getAll/${lang}/ongoing`)
			if (res.data.success && res.data.projects.length > 0) {
				setProjects(res.data.projects)
			} else {
				setProjects(getExampleData())
			}
		} catch (error) {
			console.error("Loyihalarni olishda xatolik:", error)
			setProjects(getExampleData())
		} finally {
			setLoading(false)
		}
	}

	// Example data generator
	const getExampleData = () => {
		return [
			{
				id: 1,
				companyName: "Smart Tech Solutions",
				projectName: "Sun'iy intellekt laboratoriyasi",
				contact: "+998 90 111 22 33"
			},
			{
				id: 2,
				companyName: "Green Agro Corp",
				projectName: "Organik qishloq xo'jaligi fermasi",
				contact: "+998 91 222 33 44"
			},
			{
				id: 3,
				companyName: "Modern Textile Ltd",
				projectName: "Zamonaviy to'qimachilik fabrikasi",
				contact: "+998 93 333 44 55"
			},
			{
				id: 4,
				companyName: "Eco Energy Partners",
				projectName: "Qayta tiklanadigan energiya stansiyasi",
				contact: "+998 94 444 55 66"
			},
			{
				id: 5,
				companyName: "Innovation Build Co",
				projectName: "Aqlli uy-joy majmuasi",
				contact: "+998 95 555 66 77"
			}
		]
	}

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600 text-lg">{t.loading}</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen py-8">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header Section */}
				<div className="text-center mb-8">
					<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
						{t.title}
					</h1>
					<div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
				</div>

				{/* Projects Table */}
				{!projects || projects.length === 0 ? (
					<div className="text-center py-16">
						<p className="text-gray-500 text-lg">{t.noData}</p>
					</div>
				) : (
					<div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
						{/* Table Header */}
						<div className="border-b border-gray-200 px-4 sm:px-6 py-4">
							<div className="grid grid-cols-12 gap-2 sm:gap-4 text-gray-700 font-semibold text-xs sm:text-sm md:text-base">
								<div className="col-span-1 text-center">№</div>
								<div className="col-span-4 sm:col-span-4">{t.companyName}</div>
								<div className="col-span-4 sm:col-span-4">{t.projectName}</div>
								<div className="col-span-3 sm:col-span-3">{t.contact}</div>
							</div>
						</div>

						{/* Table Body */}
						<div className="divide-y divide-gray-100">
							{projects.map((project, index) => (
								<div
									key={project.id || index}
									className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors duration-200"
								>
									<div className="grid grid-cols-12 gap-2 sm:gap-4 items-center text-xs sm:text-sm md:text-base">
										{/* Number */}
										<div className="col-span-1">
											<div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
												<span className="text-blue-600 font-semibold text-xs sm:text-sm">
													{index + 1}
												</span>
											</div>
										</div>

										{/* Company Name */}
										<div className="col-span-4 sm:col-span-4">
											<h3 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base break-words">
												{project.companyName}
											</h3>
										</div>

										{/* Project Name */}
										<div className="col-span-4 sm:col-span-4">
											<p className="text-gray-700 text-xs sm:text-sm md:text-base break-words">
												{project.projectName}
											</p>
										</div>

										{/* Contact */}
										<div className="col-span-3 sm:col-span-3">
											{project.contact && (
												<a
													href={`tel:${project.contact}`}
													className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm md:text-base break-all"
												>
													{project.contact}
												</a>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Mobile View - Cards for smaller screens */}
				<div className="mt-6 md:hidden">
					{projects.map((project, index) => (
						<div
							key={project.id || index}
							className="bg-white rounded-xl shadow-md border border-gray-200 p-4 mb-4"
						>
							<div className="flex items-start justify-between mb-3">
								<div className="flex-1">
									<h3 className="font-bold text-gray-900 text-sm">
										{project.companyName}
									</h3>
									<p className="text-gray-600 text-xs mt-1">
										{project.projectName}
									</p>
								</div>
								<div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
									<span className="text-blue-600 font-semibold text-xs">
										{index + 1}
									</span>
								</div>
							</div>

							{project.contact && (
								<div className="flex items-center gap-2">
									<a
										href={`tel:${project.contact}`}
										className="text-blue-600 hover:text-blue-700 font-medium text-sm"
									>
										{project.contact}
									</a>
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default Ongoing