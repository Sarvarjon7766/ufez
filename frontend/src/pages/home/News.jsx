import axios from 'axios'
import { ArrowRight, Calendar, Eye } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'

const News = () => {
	const navigate = useNavigate()
	const [language, setLanguage] = useState("uz")
	const [news, setNews] = useState([])
	const [loading, setLoading] = useState(true)
	const BASE_URL = import.meta.env.VITE_BASE_URL

	// LocalStorage'dan tilni o'qish
	useEffect(() => {
		const savedLang = localStorage.getItem("lang") || "uz"
		setLanguage(savedLang)
		fetchNews(savedLang)
	}, [])

	// Til o'zgarganda yangilash
	useEffect(() => {
		const handleStorageChange = () => {
			const savedLang = localStorage.getItem("lang") || "uz"
			if (savedLang !== language) {
				setLanguage(savedLang)
				fetchNews(savedLang)
			}
		}

		window.addEventListener('storage', handleStorageChange)

		const interval = setInterval(() => {
			const savedLang = localStorage.getItem("lang") || "uz"
			if (savedLang !== language) {
				setLanguage(savedLang)
				fetchNews(savedLang)
			}
		}, 1000)

		return () => {
			window.removeEventListener('storage', handleStorageChange)
			clearInterval(interval)
		}
	}, [language])

	// API dan yangiliklarni olish
	const fetchNews = async (lang = language) => {
		try {
			setLoading(true)
			const res = await axios.get(`${BASE_URL}/api/news/getOne/${lang}`)
			if (res.data.success && res.data.news.length > 0) {
				setNews(res.data.news)
			} else {
				// Agar ma'lumot bo'sh bo'lsa, example data ko'rsatish
				setNews(getExampleData())
			}
		} catch (error) {
			console.error("Yangiliklarni olishda xatolik:", error)
			// Example data agar API ishlamasa
			setNews(getExampleData())
		} finally {
			setLoading(false)
		}
	}

	// Example data generator
	const getExampleData = () => {
		return [
			{
				id: 1,
				title: "Yangi loyiha ishga tushdi",
				description: "Urgut EIZda yangi sanoat loyihasi muvaffaqiyatli ishga tushirildi. Loyiha mintaqa iqtisodiyotiga sezilarli hissa qo'shadi.",
				photos: ["/partner1.jpg"],
				createdAt: "2025-10-30",
				views: 124
			},
			{
				id: 2,
				title: "Investorlar bilan uchrashuv",
				description: "Xalqaro investorlar bilan bo'lib o'tgan uchrashuvda yangi hamkorlik shartnomalari imzolandi.",
				photos: ["/partner1.jpg"],
				createdAt: "2025-10-25",
				views: 89
			},
			{
				id: 3,
				title: "Hudud infratuzilmasi rivojlanmoqda",
				description: "Erkin iqtisodiy zona hududida yangi infratuzilma loyihalari amalga oshirilmog'da.",
				photos: ["/partner1.jpg"],
				createdAt: "2025-10-20",
				views: 156
			},
			{
				id: 4,
				title: "Yangi ish o'rinlari yaratildi",
				description: "Yangi korxonalar ochilishi natijasida 500 dan ortiq ish o'rinlari yaratildi.",
				photos: ["/partner1.jpg"],
				createdAt: "2025-10-15",
				views: 203
			},
			{
				id: 5,
				title: "Eksport hajmi oshdi",
				description: "So'nggi chorakda mintaqadan eksport hajmi 25% ga o'sdi.",
				photos: ["/partner1.jpg"],
				createdAt: "2025-10-10",
				views: 167
			},
			{
				id: 6,
				title: "Texnologiya markazi ochildi",
				description: "Yosh ixtirochilar va startup'lar uchun zamonaviy texnologiya markazi ochildi.",
				photos: ["/partner1.jpg"],
				createdAt: "2025-10-05",
				views: 98
			}
		]
	}

	// Rasm URL ni to'g'ri shakllantirish
	const getImageUrl = (photo) => {
		if (!photo) return "/partner1.jpg"

		if (photo.startsWith('http')) {
			return photo
		}

		return `${BASE_URL}${photo.startsWith('/') ? '' : '/'}${photo}`
	}

	// Sana formatini o'zgartirish (2025-11-05T06:24:56.464Z -> 2025-11-05)
	const formatDate = (dateString) => {
		if (!dateString) return ""

		// Agar dateString ISO formatida bo'lsa (T bilan)
		if (dateString.includes('T')) {
			return dateString.split('T')[0]
		}

		// Agar oddiy sana formatida bo'lsa
		return dateString
	}

	// Har bir yangilik uchun photos massividan random rasm tanlash
	const getRandomPhoto = (photos) => {
		if (!photos || photos.length === 0) return "/partner1.jpg"

		// Agar faqat bitta rasm bo'lsa, o'shasini qaytarish
		if (photos.length === 1) {
			return photos[0]
		}

		// Random index tanlash
		const randomIndex = Math.floor(Math.random() * photos.length)
		return photos[randomIndex]
	}

	const handleNews = () => {
		navigate('/allnews')
	}

	// Tarjima matnlari - faqat taglar
	const translations = {
		uz: {
			title: "Yangiliklar",
			seeAll: "Barcha Yangiliklar",
			newsLabel: "Yangilik",
			loading: "Yangiliklar yuklanmoqda..."
		},
		ru: {
			title: "Новости",
			seeAll: "Все Новости",
			newsLabel: "Новость",
			loading: "Новости загружаются..."
		},
		en: {
			title: "News",
			seeAll: "All News",
			newsLabel: "News",
			loading: "Loading news..."
		}
	}

	const t = translations[language] || translations.uz

	// Faqat dastlabki 3ta yangilikni olish
	const displayedNews = news.slice(0, 3)

	if (loading) {
		return (
			<section id="news" className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
							{t.title}
						</h2>
						<div className="w-24 h-1 bg-blue-600 mx-auto mb-6 rounded-full"></div>
					</div>
					<div className="text-center py-12">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
						<p className="text-gray-600">{t.loading}</p>
					</div>
				</div>
			</section>
		)
	}

	return (
		<section id="news" className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				{/* Sarlavha */}
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
						{t.title}
					</h2>
					<div className="w-24 h-1 bg-blue-600 mx-auto mb-6 rounded-full"></div>
				</div>

				{/* Yangiliklar grid - hamma ekranlarda 3ta */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
					{displayedNews.map((item, index) => (
						<div
							key={item.id || index}
							className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
						>
							{/* Rasm qismi - photos massividan random rasm tanlash */}
							<div className="relative h-48 overflow-hidden">
								<img
									src={getImageUrl(getRandomPhoto(item.photos))}
									alt={item.title}
									className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
								/>
								<div className="absolute top-4 left-4">
									<span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
										{t.newsLabel}
									</span>
								</div>
								<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							</div>

							{/* Kontent qismi */}
							<div className="p-6">
								{/* Sana va ko'rishlar */}
								<div className="flex items-center justify-between mb-3">
									<div className="flex items-center gap-2 text-gray-500 text-sm">
										<Calendar size={16} />
										<span>{formatDate(item.createdAt)}</span>
									</div>
									<div className="flex items-center gap-1 text-gray-500 text-sm">
										<Eye size={16} />
										<span>{item.views}</span>
									</div>
								</div>

								{/* Sarlavha */}
								<h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
									{item.title}
								</h3>

								{/* Tavsif */}
								<p className="text-gray-600 mb-4 line-clamp-3">
									{item.description}
								</p>
							</div>
						</div>
					))}
				</div>

				{/* Barcha yangiliklarni ko'rish tugmasi */}
				{news.length > 0 && (
					<div className="text-center">
						<button onClick={handleNews} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto">
							<span>{t.seeAll}</span>
							<ArrowRight size={20} />
						</button>
					</div>
				)}
			</div>
		</section>
	)
}

export default News