import axios from 'axios'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const Tasks = () => {
	const [tasks, setTasks] = useState([])
	const [loading, setLoading] = useState(true)
	const [language, setLanguage] = useState("uz")
	const BASE_URL = import.meta.env.VITE_BASE_URL

	// Tarjima matnlari
	const translations = {
		uz: {
			title: "Urgut erkin iqtisodiy zonasining funksiya va vazifalari",
			loading: "Yuklanmoqda...",
			noData: "Vazifa va funksiyalar ma'lumotlari hozircha mavjud emas."
		},
		ru: {
			title: "Функции и задачи Ургутской свободной экономической зоны",
			loading: "Загрузка...",
			noData: "Информация о функциях и задачах пока недоступна."
		},
		en: {
			title: "Functions and Tasks of Urgut Free Economic Zone",
			loading: "Loading...",
			noData: "Function and task information is not available yet."
		}
	}

	const t = translations[language] || translations.uz

	useEffect(() => {
		const savedLang = localStorage.getItem("lang") || "uz"
		setLanguage(savedLang)
		fetchTasks(savedLang)
	}, [])

	// Til o'zgarganda yangilash
	useEffect(() => {
		const handleStorageChange = () => {
			const savedLang = localStorage.getItem("lang") || "uz"
			if (savedLang !== language) {
				setLanguage(savedLang)
				fetchTasks(savedLang)
			}
		}

		window.addEventListener('storage', handleStorageChange)
		const interval = setInterval(() => {
			const savedLang = localStorage.getItem("lang") || "uz"
			if (savedLang !== language) {
				setLanguage(savedLang)
				fetchTasks(savedLang)
			}
		}, 1000)

		return () => {
			window.removeEventListener('storage', handleStorageChange)
			clearInterval(interval)
		}
	}, [language])

	const fetchTasks = async (lang = language) => {
		try {
			setLoading(true)
			const res = await axios.get(`${BASE_URL}/api/task/getAll/${lang}`)
			if (res.data.success && res.data.tasks.length > 0) {
				setTasks(res.data.tasks)
			}
		} catch (error) {
			console.error("Vazifalarni olishda xatolik:", error)
			// Example data
			setTasks([
				{
					id: 1,
					title: "Investitsiya loyihalarini qo'llab-quvvatlash va rag'batlantirish",
					description: "Yangi investitsiya loyihalarini qabul qilish, ularni amalga oshirishda yordam berish va investorlar uchun qulay sharoitlar yaratish. Bu funksiya zonaning asosiy maqsadlaridan biri bo'lib, iqtisodiy o'sishni ta'minlashga qaratilgan."
				},
				{
					id: 2,
					title: "Infratuzilmani rivojlantirish va modernizatsiya qilish",
					description: "Zona ichidagi yo'llar, kommunikatsiyalar, energetika va boshqa infratuzilma ob'ektlarini takomillashtirish. Zamonaviy infratuzilma investorlar uchun jozibador muhit yaratish va ishlab chiqarish samaradorligini oshirish uchun muhim ahamiyatga ega."
				},
				{
					id: 3,
					title: "Xalqaro hamkorlikni rivojlantirish",
					description: "Chet el kompaniyalari va tashkilotlari bilan hamkorlik aloqalarini o'rnatish va rivojlantirish. Xalqaro tajriba va texnologiyalardan foydalanish orqali zonaning raqobatbardoshligini oshirish."
				},
				{
					id: 4,
					title: "Iqtisodiy monitoring va hisobot tayyorlash",
					description: "Zonaning iqtisodiy ko'rsatkichlarini kuzatib borish va davriy hisobotlar tayyorlash. Monitoring natijalari asosida strategik qarorlar qabul qilish va kelajakdagi rivojlanish yo'nalishlarini belgilash."
				},
				{
					id: 5,
					title: "Yangi ish o'rinlari yaratish dasturini amalga oshirish",
					description: "Mahalliy aholi uchun yangi ish o'rinlari yaratish va kadrlarni tayyorlash dasturlarini amalga oshirish. Bu vazifa nafaqat iqtisodiy, balki ijtimoiy rivojlanishga ham hissa qo'shadi."
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
					<p className="text-gray-600 text-lg">{t.loading}</p>
				</div>
			</div>
		)
	}

	if (!tasks || tasks.length === 0) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
				<div className="text-center max-w-md">
					<h2 className="text-2xl font-bold text-gray-700 mb-4">{t.title}</h2>
					<p className="text-gray-500 text-lg">{t.noData}</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
			<div className="container mx-auto px-4 max-w-4xl">
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

				{/* Tasks Content */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
				>
					<div className="prose prose-lg max-w-none">
						{tasks.map((task, index) => (
							<div key={task.id} className="mb-8 last:mb-0">
								{/* Description */}
								<p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
									{index + 1}. {task.description}
								</p>

								{/* Divider (except last item) */}
								{index < tasks.length - 1 && (
									<hr className="border-gray-200 my-6" />
								)}
							</div>
						))}
					</div>
				</motion.div>
			</div>
		</div>
	)
}

export default Tasks