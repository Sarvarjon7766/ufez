import axios from "axios"
import { useEffect, useState } from "react"
import Footer from "../component/Footer"
import Navbar from "../component/Navbar"

const LandArea = () => {
	const [areas, setAreas] = useState([])
	const [loading, setLoading] = useState(true)
	const [selectedArea, setSelectedArea] = useState(null)
	const [language, setLanguage] = useState("uz")
	const BASE_URL = import.meta.env.VITE_BASE_URL

	// Tarjima matnlari
	const translations = {
		uz: {
			title: "Yer maydoni haqida ma'lumot",
			loading: "Yuklanmoqda...",
			noData: "Yer maydoni ma'lumotlari hozircha mavjud emas.",
			totalArea: "Umumiy maydoni",
			mainArea: "Bosh maydoni",
			emptyArea: "Bo'sh maydoni"
		},
		ru: {
			title: "Информация о земельных участках",
			loading: "Загрузка...",
			noData: "Информация о земельных участках пока недоступна.",
			totalArea: "Общая площадь",
			mainArea: "Основная площадь",
			emptyArea: "Свободная площадь"
		},
		en: {
			title: "Land Area Information",
			loading: "Loading...",
			noData: "Land area information is not available yet.",
			totalArea: "Total Area",
			mainArea: "Main Area",
			emptyArea: "Empty Area"
		}
	}

	const t = translations[language] || translations.uz

	useEffect(() => {
		const savedLang = localStorage.getItem("lang") || "uz"
		setLanguage(savedLang)
		fetchAreas(savedLang)
	}, [])

	// Til o'zgarganda yangilash
	useEffect(() => {
		const handleStorageChange = () => {
			const savedLang = localStorage.getItem("lang") || "uz"
			if (savedLang !== language) {
				setLanguage(savedLang)
				fetchAreas(savedLang)
			}
		}

		window.addEventListener('storage', handleStorageChange)
		const interval = setInterval(() => {
			const savedLang = localStorage.getItem("lang") || "uz"
			if (savedLang !== language) {
				setLanguage(savedLang)
				fetchAreas(savedLang)
			}
		}, 1000)

		return () => {
			window.removeEventListener('storage', handleStorageChange)
			clearInterval(interval)
		}
	}, [language])

	const fetchAreas = async (lang = language) => {
		try {
			setLoading(true)
			const res = await axios.get(`${BASE_URL}/api/landarea/getAll/${lang}`)
			if (res.data.success && res.data.areas.length > 0) {
				setAreas(res.data.areas)
			}
		} catch (error) {
			console.error("Yer maydoni ma'lumotlarini olishda xatolik:", error)
			// Example data agar API ishlamasa
			setAreas([
				{
					id: 1,
					title: "1-sektor",
					empty_area: "30 gektar",
					total_area: "150 gektar",
					photo: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80"
				},
				{
					id: 2,
					title: "2-sektor",
					empty_area: "30 gektar",
					total_area: "200 gektar",
					photo: "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?w=800&q=80"
				},
				{
					id: 3,
					title: "3-sektor",
					empty_area: "15 gektar",
					total_area: "100 gektar",
					photo: "https://images.unsplash.com/photo-1473187983305-f615310e7daa?w=800&q=80"
				},
				{
					id: 4,
					title: "4-sektor",
					empty_area: "50 gektar",
					total_area: "250 gektar",
					photo: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80"
				}
			])
		} finally {
			setLoading(false)
		}
	}

	// Rasm URL ni to'g'ri shakllantirish
	const getImageUrl = (photo) => {
		if (!photo) return "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80"

		if (photo.startsWith('http')) {
			return photo
		}

		// Agar relative path bo'lsa, baseUrl qo'shamiz
		return `${BASE_URL}${photo.startsWith('/') ? '' : '/'}${photo}`
	}

	if (loading) {
		return (
			<div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
				<header className="sticky top-0 z-50 bg-white shadow-md">
					<Navbar />
				</header>
				<main className="flex-1 flex items-center justify-center px-5 md:px-16 py-10">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
						<p className="text-gray-600 text-lg">{t.loading}</p>
					</div>
				</main>
				<Footer />
			</div>
		)
	}

	return (
		<div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
			{/* 🔹 Navbar */}
			<header className="sticky top-0 z-50 bg-white shadow-md">
				<Navbar />
			</header>

			{/* 🔹 Kontent */}
			<main className="flex-1 px-5 md:px-16 py-10">
				<div className="max-w-6xl mx-auto text-center space-y-8">
					<h1 className="text-3xl md:text-4xl font-bold text-blue-700">
						{t.title}
					</h1>

					{/* 🔹 Ma'lumotlar mavjud emas */}
					{!areas || areas.length === 0 ? (
						<div className="text-center py-16">
							<p className="text-gray-500 text-lg">{t.noData}</p>
						</div>
					) : (
						/* 🔹 Katta kartalar */
						<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
							{areas.map((area) => (
								<div
									key={area.id}
									onClick={() => setSelectedArea(area)}
									className="relative group bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
								>
									<img
										src={getImageUrl(area.photo)}
										alt={area.title}
										className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-300"
									/>
									{/* Overlay */}
									<div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
										<span className="text-white text-lg font-semibold">{area.title}</span>
									</div>
									{/* Pastki nomi har doim ko'rinadi */}
									<div className="absolute bottom-0 w-full bg-white/90 py-3">
										<h3 className="text-blue-700 font-semibold text-lg">{area.title}</h3>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</main>

			{/* 🔹 Modal */}
			{selectedArea && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
					<div className="bg-white rounded-2xl shadow-2xl w-full sm:w-3/4 md:w-1/2 relative animate-fadeIn">
						{/* ✖ Yopish tugmasi */}
						<button
							onClick={() => setSelectedArea(null)}
							className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 rounded-full p-2 text-gray-700"
						>
							✕
						</button>

						{/* Rasm */}
						<img
							src={getImageUrl(selectedArea.photo)}
							alt={selectedArea.title}
							className="w-full h-80 object-cover rounded-t-2xl"
						/>

						{/* Ma'lumotlar */}
						<div className="p-6 text-center space-y-4">
							<h2 className="text-2xl font-bold text-blue-700">{selectedArea.title}</h2>
							<p className="text-gray-700">
								<span className="font-medium text-gray-800">{t.totalArea}:</span>{" "}
								{selectedArea.total_area}
							</p>
							<p className="text-gray-700">
								<span className="font-medium text-gray-800">{t.emptyArea}:</span>{" "}
								{selectedArea.empty_area}
							</p>
						</div>
					</div>
				</div>
			)}

			{/* 🔹 Footer */}
			<Footer />
		</div>
	)
}

export default LandArea