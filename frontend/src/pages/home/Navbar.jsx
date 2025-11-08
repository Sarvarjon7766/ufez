import { ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const Navbar = () => {
	const [openMenu, setOpenMenu] = useState(null)
	const [mobileOpen, setMobileOpen] = useState(false)
	const [language, setLanguage] = useState("uz") // Default til
	const navigate = useNavigate()

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

		// Storage o'zgarishlarini kuzatish
		window.addEventListener('storage', handleStorageChange)

		// Komponentlar orasida state sync qilish uchun
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

	// Tarjima matnlari
	const translations = {
		uz: {
			home: "Bosh sahifa",
			directorate: "Urgut EIZ Direksiyasi",
			about: "Urgut EIZ haqida",
			landAreas: "Yer maydonlari",
			membership: "A'zolik tartibi va afzalliklar",
			// Direksiya menyusi
			leadership: "Rahbaryat",
			publicServices: "Davlat xizmatlari ro'yxati",
			international: "Xalqaro aloqalar",
			charter: "Urgut EIZ nizomi",
			tasks: "Vazifalari va funksiyalari",
			eGovernment: "Elektron hukumat",
			structure: "Tashkiliy tuzilma",
			details: "Rekvizitlar",
			employees: "Direksiya xodimlari",
			// Haqida menyusi
			projects: "Umumiy loyihalar",
			completedProjects: "Ishga tushgan loyihalar",
			ongoingProjects: "Amalda bo'lgan loyihalar",
			futureProjects: "Istiqbolli loyihalar",
		},
		ru: {
			home: "Главная",
			directorate: "Дирекция Ургутской ОЭЗ",
			about: "О Ургутской ОЭЗ",
			landAreas: "Земельные участки",
			membership: "Порядок членства и преимущества",
			// Direksiya menyusi
			leadership: "Руководство",
			publicServices: "Перечень государственных услуг",
			international: "Международные связи",
			charter: "Устав Ургутской ОЭЗ",
			tasks: "Задачи и функции",
			eGovernment: "Электронное правительство",
			structure: "Организационная структура",
			details: "Реквизиты",
			employees: "Сотрудники дирекции",
			// Haqida menyusi
			projects: "Общие проекты",
			completedProjects: "Запущенные проекты",
			ongoingProjects: "Текущие проекты",
			futureProjects: "Перспективные проекты",
		},
		en: {
			home: "Home",
			directorate: "Urgut FEZ Directorate",
			about: "About Urgut FEZ",
			landAreas: "Land Areas",
			membership: "Membership Terms and Benefits",
			// Direksiya menyusi
			leadership: "Leadership",
			publicServices: "List of Public Services",
			international: "International Relations",
			charter: "Urgut FEZ Charter",
			tasks: "Tasks and Functions",
			eGovernment: "E-Government",
			structure: "Organizational Structure",
			details: "Details",
			employees: "Directorate Employees",
			// Haqida menyusi
			projects: "General Projects",
			completedProjects: "Completed Projects",
			ongoingProjects: "Ongoing Projects",
			futureProjects: "Future Projects",
		}
	}

	const t = translations[language] || translations.uz

	const toggleMenu = (menu) => {
		setOpenMenu((prev) => (prev === menu ? null : menu))
	}

	const handleNavigate = (path) => {
		navigate(path)
		setMobileOpen(false)
		setOpenMenu(null)
		window.scrollTo({ top: 0, behavior: "smooth" })
	}

	const handleMouseEnter = (menu) => setOpenMenu(menu)
	const handleMouseLeave = () => setOpenMenu(null)

	return (
		<nav className="bg-transparent shadow-none sticky top-0 z-50">
			<div className="px-4 sm:px-6 lg:px-8 mx-auto flex justify-between items-center">
				{/* 🔹 Logo */}
				<div
					onClick={() => handleNavigate("/")}
					className="flex items-center space-x-2 p-2 sm:p-3 cursor-pointer"
				>
					<img src="/logo.png" alt="UFEZ Logo" className="h-10 sm:h-12 w-auto" />
				</div>

				{/* 🔹 Desktop menyu */}
				<ul className="hidden md:flex items-center space-x-4 lg:space-x-6 font-medium">
					<li
						onClick={() => handleNavigate("/")}
						className="text-white hover:text-yellow-300 transition py-2 text-sm lg:text-base cursor-pointer"
					>
						{t.home}
					</li>

					{/* Urgut EIZ Direksiyasi */}
					<li
						className="relative"
						onMouseEnter={() => handleMouseEnter("direksiya")}
						onMouseLeave={handleMouseLeave}
					>
						<button className="flex items-center gap-1 text-white hover:text-yellow-300 py-2 text-sm lg:text-base">
							{t.directorate}
							<ChevronDown
								size={16}
								className={`transition-transform ${openMenu === "direksiya" ? "rotate-180" : ""}`}
							/>
						</button>

						{openMenu === "direksiya" && (
							<div className="absolute left-0 top-full bg-white border border-gray-200 shadow-lg rounded-md w-56 lg:w-64 z-50 animate-fadeIn">
								<ul className="p-3 space-y-2 text-sm">
									{[
										{ path: "/about-us/team", text: t.leadership },
										{ path: "/about-us/public-services", text: t.publicServices },
										{ path: "/about-us/international", text: t.international },
										{ path: "/about-us/charter", text: t.charter },
										{ path: "/about-us/tasks", text: t.tasks },
										{ path: "/about-us/government", text: t.eGovernment },
										{ path: "/about-us/structure", text: t.structure },
										{ path: "/about-us/details", text: t.details },
										{ path: "/about-us/employees", text: t.employees },
									].map((item) => (
										<li
											key={item.path}
											onClick={() => handleNavigate(item.path)}
											className="block hover:bg-blue-50 rounded px-2 py-1.5 text-gray-700 cursor-pointer"
										>
											{item.text}
										</li>
									))}
								</ul>
							</div>
						)}
					</li>

					{/* Urgut EIZ Haqida */}
					<li
						className="relative"
						onMouseEnter={() => handleMouseEnter("haqida")}
						onMouseLeave={handleMouseLeave}
					>
						<button className="flex items-center gap-1 text-white hover:text-yellow-300 py-2 text-sm lg:text-base">
							{t.about}
							<ChevronDown
								size={16}
								className={`transition-transform ${openMenu === "haqida" ? "rotate-180" : ""}`}
							/>
						</button>

						{openMenu === "haqida" && (
							<div className="absolute left-0 top-full bg-white border border-gray-200 shadow-lg rounded-md w-56 lg:w-64 z-50 animate-fadeIn">
								<ul className="p-3 space-y-2 text-sm">
									{[
										{ path: "/projects", text: t.projects },
										{ path: "/projects/completed", text: t.completedProjects },
										{ path: "/projects/ongoing", text: t.ongoingProjects },
										{ path: "/projects/offer", text: t.futureProjects },
									].map((item) => (
										<li
											key={item.path}
											onClick={() => handleNavigate(item.path)}
											className="block hover:bg-blue-50 rounded px-2 py-1.5 text-gray-700 cursor-pointer"
										>
											{item.text}
										</li>
									))}
								</ul>
							</div>
						)}
					</li>

					<li
						onClick={() => handleNavigate("/landarea")}
						className="text-white hover:text-yellow-300 py-2 text-sm lg:text-base cursor-pointer"
					>
						{t.landAreas}
					</li>

					<li
						onClick={() => handleNavigate("/membership")}
						className="text-white hover:text-yellow-300 py-2 text-sm lg:text-base cursor-pointer"
					>
						{t.membership}
					</li>
				</ul>

				{/* 🔹 Mobil menyu tugmasi */}
				<button
					className="md:hidden p-2 rounded-lg border border-white/30 text-white hover:text-yellow-300 hover:border-yellow-300 transition"
					onClick={() => setMobileOpen((prev) => !prev)}
				>
					{mobileOpen ? (
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					) : (
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					)}
				</button>
			</div>

			{/* 🔹 Mobil menyu */}
			<div
				className={`md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200 transition-all duration-500 overflow-hidden ${mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
					}`}
			>
				<div className="px-4 py-2 space-y-2">
					{/* Bosh sahifa */}
					<div
						onClick={() => handleNavigate("/")}
						className="block py-2 px-3 text-gray-700 hover:bg-blue-50 rounded-lg cursor-pointer"
					>
						{t.home}
					</div>

					{/* Direksiya mobil */}
					<div>
						<button
							onClick={() => toggleMenu("direksiya-mobile")}
							className="flex justify-between w-full py-2 px-3 text-gray-700 hover:bg-blue-50 rounded-lg"
						>
							<span>{t.directorate}</span>
							<ChevronDown
								size={16}
								className={`transition-transform ${openMenu === "direksiya-mobile" ? "rotate-180" : ""}`}
							/>
						</button>
						{openMenu === "direksiya-mobile" && (
							<ul className="pl-6 py-2 space-y-1 text-sm">
								{[
									{ path: "/about-us/team", text: t.leadership },
									{ path: "/about-us/public-services", text: t.publicServices },
									{ path: "/about-us/international", text: t.international },
									{ path: "/about-us/charter", text: t.charter },
									{ path: "/about-us/tasks", text: t.tasks },
									{ path: "/about-us/government", text: t.eGovernment },
									{ path: "/about-us/structure", text: t.structure },
									{ path: "/about-us/details", text: t.details },
									{ path: "/about-us/employees", text: t.employees },
								].map((item) => (
									<li
										key={item.path}
										onClick={() => handleNavigate(item.path)}
										className="block py-1.5 text-gray-600 hover:text-blue-700 cursor-pointer"
									>
										{item.text}
									</li>
								))}
							</ul>
						)}
					</div>

					{/* Haqida mobil */}
					<div>
						<button
							onClick={() => toggleMenu("haqida-mobile")}
							className="flex justify-between w-full py-2 px-3 text-gray-700 hover:bg-blue-50 rounded-lg"
						>
							<span>{t.about}</span>
							<ChevronDown
								size={16}
								className={`transition-transform ${openMenu === "haqida-mobile" ? "rotate-180" : ""}`}
							/>
						</button>
						{openMenu === "haqida-mobile" && (
							<ul className="pl-6 py-2 space-y-1 text-sm">
								{[
									{ path: "/projects", text: t.projects },
									{ path: "/projects/completed", text: t.completedProjects },
									{ path: "/projects/ongoing", text: t.ongoingProjects },
									{ path: "/projects/offer", text: t.futureProjects },
								].map((item) => (
									<li
										key={item.path}
										onClick={() => handleNavigate(item.path)}
										className="block py-1.5 text-gray-600 hover:text-blue-700 cursor-pointer"
									>
										{item.text}
									</li>
								))}
							</ul>
						)}
					</div>

					{/* Yer maydonlari */}
					<div
						onClick={() => handleNavigate("/landarea")}
						className="block py-2 px-3 text-gray-700 hover:bg-blue-50 rounded-lg cursor-pointer"
					>
						{t.landAreas}
					</div>

					{/* A'zolik */}
					<div
						onClick={() => handleNavigate("/membership")}
						className="block py-2 px-3 text-gray-700 hover:bg-blue-50 rounded-lg cursor-pointer"
					>
						{t.membership}
					</div>
				</div>
			</div>
		</nav>
	)
}

export default Navbar