import {
	FileText,
	Globe,
	ListChecks,
	Menu,
	MonitorDot,
	Receipt,
	Share2,
	Target,
	UserCog,
	Users,
	X,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Sitebar = () => {
	const navigate = useNavigate()
	const [active, setActive] = useState("rahbariyat")
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
			menuTitle: "Direksiya menyusi",
			leadership: "Rahbariyat",
			publicServices: "Davlat xizmatlari ro'yxati",
			international: "Xalqaro aloqalar",
			charter: "Urgut EIZ nizomi",
			tasks: "Urgut EIZning vazifalari",
			eGovernment: "Elektron hukumat",
			structure: "Tashkiliy tuzilmasi",
			details: "Rekvizitlar",
			employees: "Direksiya xodimlari"
		},
		ru: {
			menuTitle: "Меню Дирекции",
			leadership: "Руководство",
			publicServices: "Перечень государственных услуг",
			international: "Международные связи",
			charter: "Устав Ургутской ОЭЗ",
			tasks: "Задачи Ургутской ОЭЗ",
			eGovernment: "Электронное правительство",
			structure: "Организационная структура",
			details: "Реквизиты",
			employees: "Сотрудники дирекции"
		},
		en: {
			menuTitle: "Directorate Menu",
			leadership: "Leadership",
			publicServices: "List of Public Services",
			international: "International Relations",
			charter: "Urgut FEZ Charter",
			tasks: "Urgut FEZ Tasks",
			eGovernment: "E-Government",
			structure: "Organizational Structure",
			details: "Details",
			employees: "Directorate Employees"
		}
	}

	const t = translations[language] || translations.uz

	// 🔹 Menyu elementlari
	const menu = [
		{ id: "rahbariyat", label: t.leadership, icon: <Users className="w-5 h-5" />, path: "/about-us/team" },
		{
			id: "davlat-xizmatlari",
			label: t.publicServices,
			icon: <ListChecks className="w-5 h-5" />,
			path: "/about-us/public-services",
		},
		{
			id: "xalqaro-aloqalar",
			label: t.international,
			icon: <Globe className="w-5 h-5" />,
			path: "/about-us/international",
		},
		{
			id: "nizom",
			label: t.charter,
			icon: <FileText className="w-5 h-5" />,
			path: "/about-us/charter",
		},
		{
			id: "vazifalar",
			label: t.tasks,
			icon: <Target className="w-5 h-5" />,
			path: "/about-us/tasks",
		},
		{
			id: "elektron-hukumat",
			label: t.eGovernment,
			icon: <MonitorDot className="w-5 h-5" />,
			path: "/about-us/government",
		},
		{
			id: "tashkiliy-tuzilma",
			label: t.structure,
			icon: <Share2 className="w-5 h-5" />,
			path: "/about-us/structure",
		},
		{
			id: "rekvizitlar",
			label: t.details,
			icon: <Receipt className="w-5 h-5" />,
			path: "/about-us/details",
		},
		{
			id: "xodimlar",
			label: t.employees,
			icon: <UserCog className="w-5 h-5" />,
			path: "/about-us/employees",
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
				className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0 md:max-h-none md:opacity-100"
					}`}
			>
				<div className="space-y-1 mt-2 md:mt-0">
					{menu.map((item) => (
						<button
							key={item.id}
							onClick={() => handleClick(item.id, item.path)}
							className={`w-full flex items-center gap-3 px-4 py-2 rounded-md text-left transition-colors
								${active === item.id
									? "text-blue-600 font-medium"
									: "text-gray-700 hover:text-blue-600"
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