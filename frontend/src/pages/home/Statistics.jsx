import { Briefcase, Building2, DollarSign, Globe, TrendingUp, Users } from "lucide-react"
import { useEffect, useState } from "react"

const Statistics = () => {
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

	// Tarjima matnlari - faqat sarlavha
	const translations = {
		uz: {
			title: "Statistika"
		},
		ru: {
			title: "Статистика"
		},
		en: {
			title: "Statistics"
		}
	}

	const t = translations[language] || translations.uz

	const stats = [
		{
			label: "Investitsiyalar",
			value: "2.1B",
			icon: DollarSign,
			color: "text-green-600",
			bgColor: "bg-gradient-to-br from-green-100 to-green-200",
			borderColor: "border-green-300",
			glowColor: "shadow-green-200"
		},
		{
			label: "Korxonalar",
			value: "150+",
			icon: Building2,
			color: "text-blue-600",
			bgColor: "bg-gradient-to-br from-blue-100 to-blue-200",
			borderColor: "border-blue-300",
			glowColor: "shadow-blue-200"
		},
		{
			label: "Ish O'rinlari",
			value: "12.5K",
			icon: Users,
			color: "text-purple-600",
			bgColor: "bg-gradient-to-br from-purple-100 to-purple-200",
			borderColor: "border-purple-300",
			glowColor: "shadow-purple-200"
		},
		{
			label: "Loyihalar",
			value: "284",
			icon: Briefcase,
			color: "text-orange-600",
			bgColor: "bg-gradient-to-br from-orange-100 to-orange-200",
			borderColor: "border-orange-300",
			glowColor: "shadow-orange-200"
		},
		{
			label: "Hamkorlar",
			value: "47",
			icon: Globe,
			color: "text-cyan-600",
			bgColor: "bg-gradient-to-br from-cyan-100 to-cyan-200",
			borderColor: "border-cyan-300",
			glowColor: "shadow-cyan-200"
		},
		{
			label: "O'sish",
			value: "34%",
			icon: TrendingUp,
			color: "text-red-600",
			bgColor: "bg-gradient-to-br from-red-100 to-red-200",
			borderColor: "border-red-300",
			glowColor: "shadow-red-200"
		}
	]

	return (
		<section id="statistics" className="py-16 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
			{/* Background decoration */}
			<div className="absolute inset-0 opacity-5">
				<div className="absolute top-10 left-10 w-20 h-20 bg-blue-400 rounded-full blur-xl"></div>
				<div className="absolute top-32 right-20 w-16 h-16 bg-green-400 rounded-full blur-xl"></div>
				<div className="absolute bottom-20 left-1/4 w-24 h-24 bg-purple-400 rounded-full blur-xl"></div>
			</div>

			<div className="container mx-auto px-4 relative z-10">
				{/* Sarlavha */}
				<div className="text-center mb-12">
					<div className="inline-flex items-center gap-3 mb-4">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-800">
							{t.title}
						</h2>
					</div>
				</div>

				{/* Statistika kartalari */}
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
					{stats.map((item, index) => {
						const IconComponent = item.icon
						return (
							<div
								key={index}
								className={`
									group relative p-4 bg-white rounded-2xl border-2 ${item.borderColor}
									hover:shadow-2xl ${item.glowColor} hover:scale-105 hover:-translate-y-1
									transition-all duration-500 transform overflow-hidden
									text-center
								`}
							>
								{/* Background gradient overlay */}
								<div className={`absolute inset-0 ${item.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}></div>

								{/* Animated border */}
								<div className={`absolute inset-0 rounded-2xl border-2 ${item.borderColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-5`}></div>

								{/* Icon with creative design */}
								<div className={`
									relative inline-flex p-3 rounded-2xl bg-white ${item.color} 
									mb-3 group-hover:scale-110 group-hover:rotate-6
									transition-all duration-500 shadow-lg
									border-2 ${item.borderColor}
								`}>
									<IconComponent size={20} />
									{/* Icon glow effect */}
									<div className={`absolute inset-0 ${item.bgColor} rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}></div>
								</div>

								{/* Value with creative typography */}
								<div className="relative mb-2">
									<div className="text-xl font-bold text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-gray-800 group-hover:to-gray-600 group-hover:bg-clip-text transition-all duration-500">
										{item.value}
									</div>
									{/* Value shadow effect */}
									<div className="absolute inset-0 text-xl font-bold text-transparent bg-gradient-to-r from-gray-400 to-gray-300 bg-clip-text opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500">
										{item.value}
									</div>
								</div>

								{/* Label with creative design */}
								<div className="relative">
									<div className={`text-xs font-semibold ${item.color} group-hover:scale-105 transition-transform duration-500`}>
										{item.label}
									</div>
									{/* Underline animation */}
									<div className={`w-0 h-0.5 ${item.bgColor} mx-auto group-hover:w-6 transition-all duration-500`}></div>
								</div>

								{/* Floating particles */}
								<div className="absolute top-2 right-2 w-1 h-1 bg-gray-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500"></div>
								<div className="absolute bottom-2 left-2 w-1 h-1 bg-gray-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500 delay-200"></div>
							</div>
						)
					})}
				</div>

				{/* Bottom decorative element */}
				<div className="text-center mt-12">
					<div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 border-2 border-gray-200 shadow-lg">
						<div className="flex space-x-1">
							<div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
							<div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
							<div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Statistics