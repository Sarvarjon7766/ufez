import {
	Building2, // Loyihalar
	CheckCircle2, // Tugallangan Loyihalar
	FileCode2, // Amaldagi Loyihalar
	Lightbulb, // Taklif etilayotgan Loyihalar
	Menu,
	X
} from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const Sitebar = () => {
	const navigate = useNavigate()
	const [active, setActive] = useState("loyihalar")
	const [isOpen, setIsOpen] = useState(false)
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
			menuTitle: "Loyihalar menyusi",
			projects: "Loyihalar",
			completedProjects: "Tugallangan Loyihalar",
			ongoingProjects: "Amaldagi Loyihalar",
			offeredProjects: "Taklif etilayotgan Loyihalar"
		},
		ru: {
			menuTitle: "Меню Проектов",
			projects: "Проекты",
			completedProjects: "Завершенные Проекты",
			ongoingProjects: "Текущие Проекты",
			offeredProjects: "Предлагаемые Проекты"
		},
		en: {
			menuTitle: "Projects Menu",
			projects: "Projects",
			completedProjects: "Completed Projects",
			ongoingProjects: "Ongoing Projects",
			offeredProjects: "Offered Projects"
		}
	}

	const t = translations[language] || translations.uz

	// 🔹 Menyu elementlari
	const menu = [
		{
			id: "tugallangan-loyihalar",
			label: t.completedProjects,
			icon: <CheckCircle2 className="w-5 h-5" />,
			path: "/projects/completed",
		},
		{
			id: "amaldagi-loyihalar",
			label: t.ongoingProjects,
			icon: <FileCode2 className="w-5 h-5" />,
			path: "/projects/ongoing",
		},
		{
			id: "taklif-etilayotgan",
			label: t.offeredProjects,
			icon: <Lightbulb className="w-5 h-5" />,
			path: "/projects/offer",
		},
	]

	// 🔹 Bosilganda aktiv bo'lishi va navigatsiya qilish
	const handleClick = (id, path) => {
		setActive(id)
		navigate(path)
		setIsOpen(false) // mobil holatda avtomatik yopiladi
	}

	return (
		<div className="w-full">
			{/* 🔹 Mobil menyu tugmasi (faqat md dan kichiklarda) */}
			<div className="flex justify-between items-center md:hidden px-4 py-2 border-b">
				<h2 className="text-base font-semibold text-gray-800">{t.menuTitle}</h2>
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="p-2 text-gray-700 hover:text-blue-600 transition"
				>
					{isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
				</button>
			</div>

			{/* 🔹 Menyu ro'yxati */}
			<nav
				className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen
					? "max-h-[800px] opacity-100"
					: "max-h-0 opacity-0 md:max-h-none md:opacity-100"
					}`}
			>
				<div className="space-y-1 mt-2 md:mt-0">
					{menu.map((item) => (
						<button
							key={item.id}
							onClick={() => handleClick(item.id, item.path)}
							className={`w-full flex items-center gap-3 px-4 py-2 rounded-md text-left transition-colors
                ${active === item.id
									? "text-blue-600 font-medium bg-blue-50"
									: "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
								}`}
						>
							{item.icon}
							<span className="text-sm md:text-base">{item.label}</span>
						</button>
					))}
				</div>
			</nav>
		</div>
	)
}

export default Sitebar