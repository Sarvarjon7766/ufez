import axios from 'axios'
import { motion } from "framer-motion"
import { Mail, Phone } from "lucide-react"
import { useEffect, useState } from "react"

const Team = () => {
	const [team, setTeam] = useState([])
	const [loading, setLoading] = useState(true)
	const [language, setLanguage] = useState("uz")

	// LocalStorage'dan tilni o'qish va komponent yuklanganda API dan ma'lumot olish
	useEffect(() => {
		const savedLang = localStorage.getItem("lang") || "uz"
		setLanguage(savedLang)

		// Komponent yuklanganda ma'lumotlarni olish
		fetchData(savedLang)
	}, [])

	// Til o'zgarganda yangilash
	useEffect(() => {
		const handleStorageChange = () => {
			const savedLang = localStorage.getItem("lang") || "uz"
			if (savedLang !== language) {
				setLanguage(savedLang)
				fetchData(savedLang)
			}
		}

		window.addEventListener('storage', handleStorageChange)

		const interval = setInterval(() => {
			const savedLang = localStorage.getItem("lang") || "uz"
			if (savedLang !== language) {
				setLanguage(savedLang)
				fetchData(savedLang)
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
			title: "Rahbariyat",
			noData: "Hozircha jamoa ma'lumotlari mavjud emas.",
			loading: "Yuklanmoqda..."
		},
		ru: {
			title: "Руководство",
			noData: "Информация о команде пока недоступна.",
			loading: "Загрузка..."
		},
		en: {
			title: "Leadership",
			noData: "Team information is not available yet.",
			loading: "Loading..."
		}
	}

	const t = translations[language] || translations.uz

	// API dan ma'lumot olish funksiyasi
	const fetchData = async (lang = language) => {
		try {
			setLoading(true)
			console.log("Til:", lang)
			const result = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/leader/getAll/${lang}`)
			console.log("API javobi:", result)
			if (result.data.success) {
				setTeam(result.data.leaders)
			}
		} catch (error) {
			console.error("API dan ma'lumot olishda xatolik:", error)
			// Agar API dan ma'lumot kelmasa, exampleData ni ishlatamiz
			const exampleData = [
				{
					photo: "https://randomuser.me/api/portraits/men/10.jpg",
					fullName: "Egamberdiyev Sarvar",
					position: "Direktor",
					phone: "+998 97 438 08 96",
					email: "sarvaregamberdiyev758@gmail.uz",
				},
				{
					photo: "https://randomuser.me/api/portraits/women/21.jpg",
					fullName: "Egamberdiyev Sarvar",
					position: "Direktor",
					phone: "+998 97 438 08 96",
					email: "sarvaregamberdiyev758@gmail.uz",
				},
				{
					photo: "https://randomuser.me/api/portraits/men/22.jpg",
					fullName: "Egamberdiyev Sarvar",
					position: "Direktor",
					phone: "+998 97 438 08 96",
					email: "sarvaregamberdiyev758@gmail.uz",
				},
				{
					photo: "https://randomuser.me/api/portraits/women/5.jpg",
					fullName: "Egamberdiyev Sarvar",
					position: "Direktor",
					phone: "+998 97 438 08 96",
					email: "sarvaregamberdiyev758@gmail.uz",
				},
				{
					photo: "https://randomuser.me/api/portraits/men/7.jpg",
					fullName: "Egamberdiyev Sarvar",
					position: "Direktor",
					phone: "+998 97 438 08 96",
					email: "sarvaregamberdiyev758@gmail.uz",
				},
			]
			setTeam(exampleData)
		} finally {
			setLoading(false)
		}
	}

	if (loading) {
		return (
			<div className="flex justify-center items-center py-24">
				<div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
				<span className="ml-3 text-gray-600">{t.loading}</span>
			</div>
		)
	}

	return (
		<div className="min-h-screen via-white to-purple-50 py-12">
			<motion.h1
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="text-4xl font-extrabold mb-12 text-center text-gray-800 tracking-tight"
			>
				{t.title}
			</motion.h1>

			<div className="container mx-auto max-w-7xl px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
				{team.map((member, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: index * 0.1 }}
						whileHover={{ scale: 1.03 }}
						className="relative group bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
					>
						{/* Rasm */}
						<div className="relative w-full h-72 overflow-hidden">
							<img
								src={member.photo?.startsWith('http') ? member.photo : `${import.meta.env.VITE_BASE_URL}${member.photo}`}
								alt={member.fullName}
								className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
								onError={(e) => {
									// Rasm yuklanmasa, fallback rasm ko'rsatish
									e.target.src = "https://randomuser.me/api/portraits/men/10.jpg"
								}}
							/>
							{/* Overlay */}
							<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 text-white">
								<p className="text-sm mb-1 flex items-center gap-2">
									<Phone size={16} /> {member.phone}
								</p>
								<p className="text-sm flex items-center gap-2">
									<Mail size={16} /> {member.email}
								</p>
							</div>
						</div>

						{/* Ma'lumotlar */}
						<div className="p-6 text-center space-y-1">
							<h2 className="text-lg font-semibold text-gray-800">{member.fullName}</h2>
							<p className="text-blue-600 font-medium">{member.position}</p>
						</div>
					</motion.div>
				))}
			</div>

			{team.length === 0 && (
				<div className="text-center text-gray-500 mt-10">
					{t.noData}
				</div>
			)}
		</div>
	)
}

export default Team