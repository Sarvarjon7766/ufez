import { Heart, Mail, MapPin, Phone } from "lucide-react"
import { useEffect, useState } from "react"

const Footer = () => {
	const [language, setLanguage] = useState("uz")

	// LocalStorage'dan tilni o'qish
	useEffect(() => {
		const savedLang = localStorage.getItem("lang") || "uz"
		setLanguage(savedLang)
	}, [])

	// Til o'zgarganda yangilash
	useEffect(() => {
		const handleStorageChange = () => {
			const savedLang = localStorage.getItem("lang") || "uz"
			setLanguage(savedLang)
		}

		window.addEventListener('storage', handleStorageChange)

		const interval = setInterval(() => {
			const savedLang = localStorage.getItem("lang") || "uz"
			if (savedLang !== language) {
				setLanguage(savedLang)
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
			organizationName: '"Urgut erkin iqtisodiy zona Direktsiyasi"',
			organizationType: "Davlat unitar korxonasi",
			description: "Investitsiyalar va taraqqiyot markazi. Yangi Urgut bozorida joylashgan erkin iqtisodiy zona direktsiyasi mintaqa iqtisodiyotini rivojlantirishga yo'naltirilgan.",
			contactInfo: "Aloqa Ma'lumotlari",
			trustPhone: "Ishonch telefoni",
			email: "Elektron manzil",
			address: "Yangi Urgut Bozori",
			location: "Samarqand viloyati, O'zbekiston",
			projectBy: "Loyiha",
			developedBy: "tomonidan ishlab chiqilgan",
			allRights: "Barcha huquqlar himoyalangan"
		},
		ru: {
			organizationName: '"Дирекция Ургутской свободной экономической зоны"',
			organizationType: "Государственное унитарное предприятие",
			description: "Центр инвестиций и развития. Дирекция свободной экономической зоны, расположенная на территории Нового Ургутского базара, ориентирована на развитие экономики региона.",
			contactInfo: "Контактная Информация",
			trustPhone: "Телефон доверия",
			email: "Электронная почта",
			address: "Новый Ургутский Базар",
			location: "Самаркандская область, Узбекистан",
			projectBy: "Проект",
			developedBy: "разработан",
			allRights: "Все права защищены"
		},
		en: {
			organizationName: '"Urgut Free Economic Zone Directorate"',
			organizationType: "State Unitary Enterprise",
			description: "Center of investments and development. The free economic zone directorate located in New Urgut Bazaar is focused on developing the regional economy.",
			contactInfo: "Contact Information",
			trustPhone: "Trust Phone",
			email: "Email",
			address: "New Urgut Bazaar",
			location: "Samarkand Region, Uzbekistan",
			projectBy: "Project",
			developedBy: "developed by",
			allRights: "All rights reserved"
		}
	}

	const t = translations[language] || translations.uz

	return (
		<footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
			{/* Asosiy footer kontenti */}
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
					{/* Chap qism: Logo va tashkilot ma'lumotlari */}
					<div className="space-y-6">
						{/* Logo va nom */}
						<div className="flex items-center gap-4">
							<img
								src="/logo.png"
								alt="UFEZ Logo"
								className="h-16 w-16 object-contain"
							/>
							<div>
								<h3 className="text-xl font-bold mb-1">
									{t.organizationName}
								</h3>
								<p className="text-blue-200 text-sm">
									{t.organizationType}
								</p>
							</div>
						</div>

						{/* Tashkilot haqida qisqacha */}
						<p className="text-blue-100 text-sm leading-relaxed max-w-md">
							{t.description}
						</p>
					</div>

					{/* O'ng qism: Aloqa ma'lumotlari */}
					<div className="space-y-4">
						<h4 className="text-lg font-semibold mb-4 border-l-4 border-yellow-400 pl-3">
							{t.contactInfo}
						</h4>

						{/* Telefon */}
						<div className="flex items-center gap-3 text-blue-100 hover:text-white transition-colors">
							<div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
								<Phone size={18} />
							</div>
							<div>
								<p className="font-medium">+998 (71) 200-00-00</p>
								<p className="text-sm text-blue-200">{t.trustPhone}</p>
							</div>
						</div>

						{/* Email */}
						<div className="flex items-center gap-3 text-blue-100 hover:text-white transition-colors">
							<div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
								<Mail size={18} />
							</div>
							<div>
								<p className="font-medium">info@ufez.uz</p>
								<p className="text-sm text-blue-200">{t.email}</p>
							</div>
						</div>

						{/* Manzil */}
						<div className="flex items-start gap-3 text-blue-100 hover:text-white transition-colors">
							<div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center mt-1">
								<MapPin size={18} />
							</div>
							<div>
								<p className="font-medium">{t.address}</p>
								<p className="text-sm text-blue-200">{t.location}</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Pastki chiziq */}
			<div className="border-t border-blue-700"></div>

			{/* Pastki qism */}
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:text-left">
					{/* Chap qism: Loyiha haqida */}
					<div className="text-blue-200 text-sm">
						<p>
							{t.projectBy}{" "}
							<span className="text-yellow-400 font-semibold">
								Samarqand AKTRM
							</span>{" "}
							{t.developedBy}{" "}
							<span className="text-white font-bold">2025</span>
						</p>
					</div>

					{/* O'ng qism: Huquqlar */}
					<div className="text-blue-200 text-sm flex items-center justify-center md:justify-end gap-1">
						<span>© {new Date().getFullYear()} {t.allRights}</span>
						<Heart size={14} className="text-red-400 fill-current" />
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer