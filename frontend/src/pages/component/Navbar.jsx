import { ChevronDown } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

const Navbar = () => {
	const [openMenu, setOpenMenu] = useState(null)
	const [mobileOpen, setMobileOpen] = useState(false)
	const [openDesktopLangMenu, setOpenDesktopLangMenu] = useState(false)
	const [openMobileLangMenu, setOpenMobileLangMenu] = useState(false)
	const navigate = useNavigate()
	const desktopLangMenuRef = useRef(null)
	const mobileLangMenuRef = useRef(null)

	// Language configuration
	const languages = [
		{ code: "uz", name: "O'zbek", flag: "/uzbekistan.png" },
		{ code: "ru", name: "Русский", flag: "/russian.png" },
		{ code: "en", name: "English", flag: "/uk.png" },
	]

	// Get initial language from localStorage or default to Uzbek
	const [language, setLanguage] = useState(() => {
		return localStorage.getItem("lang") || "uz"
	})

	const currentLang = languages.find(lang => lang.code === language) || languages[0]

	// Tarjima matnlari - faqat taglar
	const translations = {
		uz: {
			home: "Bosh sahifa",
			directorate: "Urgut EIZ Direksiyasi",
			about: "Urgut EIZ haqida",
			landAreas: "Yer maydonlari",
			membership: "A'zolik tartibi va afzalliklar",
			// Direksiya menyusi
			directorateSections: "Direksiya Bo'limlari",
			team: "Direksiya jamoasi",
			services: "Ko'rsatilayotgan xizmatlar",
			international: "Xalqaro hamkorlik",
			charter: "Nizom",
			tasks: "Vazifalar",
			leadership: "Direksiya rahbariyati",
			structure: "Tashkiliy tuzilma",
			details: "Direksiya rekvizitlari",
			employees: "Xodimlar",
			// Haqida menyusi
			projects: "Loyihalar",
			completedProjects: "Tugallangan loyihalar",
			ongoingProjects: "Amaldagi loyihalar",
			offeredProjects: "Taklif etilayotgan loyihalar"
		},
		ru: {
			home: "Главная",
			directorate: "Дирекция Ургутской ОЭЗ",
			about: "О Ургутской ОЭЗ",
			landAreas: "Земельные участки",
			membership: "Порядок членства и преимущества",
			// Direksiya menyusi
			directorateSections: "Отделы Дирекции",
			team: "Команда дирекции",
			services: "Предоставляемые услуги",
			international: "Международное сотрудничество",
			charter: "Устав",
			tasks: "Задачи",
			leadership: "Руководство дирекции",
			structure: "Организационная структура",
			details: "Реквизиты дирекции",
			employees: "Сотрудники",
			// Haqida menyusi
			projects: "Проекты",
			completedProjects: "Завершенные проекты",
			ongoingProjects: "Текущие проекты",
			offeredProjects: "Предлагаемые проекты"
		},
		en: {
			home: "Home",
			directorate: "Urgut FEZ Directorate",
			about: "About Urgut FEZ",
			landAreas: "Land Areas",
			membership: "Membership Terms and Benefits",
			// Direksiya menyusi
			directorateSections: "Directorate Sections",
			team: "Directorate Team",
			services: "Services Provided",
			international: "International Cooperation",
			charter: "Charter",
			tasks: "Tasks",
			leadership: "Directorate Leadership",
			structure: "Organizational Structure",
			details: "Directorate Details",
			employees: "Employees",
			// Haqida menyusi
			projects: "Projects",
			completedProjects: "Completed Projects",
			ongoingProjects: "Ongoing Projects",
			offeredProjects: "Offered Projects"
		}
	}

	const t = translations[language] || translations.uz

	const toggleMenu = (menu) => {
		setOpenMenu(openMenu === menu ? null : menu)
	}

	const handleMouseEnter = (menu) => setOpenMenu(menu)
	const handleMouseLeave = () => setOpenMenu(null)

	const handleNavigate = (path) => {
		navigate(path)
		setOpenMenu(null)
		setMobileOpen(false)
		window.scrollTo({ top: 0, behavior: "smooth" })
	}

	const handleLanguageChange = (lang) => {
		console.log("Changing language to:", lang.code)
		setLanguage(lang.code)
		localStorage.setItem("lang", lang.code)
		setOpenDesktopLangMenu(false)
		setOpenMobileLangMenu(false)
		// Til o'zgarganda sahifani yangilash
		window.location.reload()
	}

	const toggleDesktopLangMenu = () => {
		console.log("Toggle desktop lang menu")
		setOpenDesktopLangMenu(!openDesktopLangMenu)
	}

	const toggleMobileLangMenu = () => {
		console.log("Toggle mobile lang menu")
		setOpenMobileLangMenu(!openMobileLangMenu)
	}

	// Close language menus when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			// Desktop language menu
			if (desktopLangMenuRef.current && !desktopLangMenuRef.current.contains(event.target)) {
				setOpenDesktopLangMenu(false)
			}
			// Mobile language menu  
			if (mobileLangMenuRef.current && !mobileLangMenuRef.current.contains(event.target)) {
				setOpenMobileLangMenu(false)
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [])

	return (
		<nav className="bg-gradient-to-r from-blue-700 to-blue-800 shadow-lg sticky top-0 z-50 border-b-2 border-blue-700">
			{/* Header */}
			<div className="px-4 sm:px-6 lg:px-8 mx-auto flex justify-between items-center">
				{/* Logo */}
				<div
					onClick={() => handleNavigate("/")}
					className="flex items-center space-x-3 p-2 sm:p-3 group cursor-pointer"
				>
					<img
						src="/logo.png"
						alt="UFEZ Logo"
						className="h-10 sm:h-12 w-auto transition-transform duration-300 group-hover:scale-110"
					/>
				</div>

				{/* Desktop Menu */}
				<ul className="hidden md:flex items-center space-x-1 lg:space-x-2 font-medium">
					<li>
						<button
							onClick={() => handleNavigate("/")}
							className="text-white hover:text-yellow-300 hover:bg-blue-600 transition-all duration-200 py-3 px-4 rounded-lg text-sm lg:text-base font-semibold"
						>
							{t.home}
						</button>
					</li>

					{/* Urgut EIZ Direksiyasi */}
					<li
						className="relative"
						onMouseEnter={() => handleMouseEnter("direksiya")}
						onMouseLeave={handleMouseLeave}
					>
						<button className="flex items-center gap-1 text-white hover:text-yellow-300 hover:bg-blue-600 transition-all duration-200 py-3 px-4 rounded-lg text-sm lg:text-base font-semibold">
							{t.directorate}
							<ChevronDown
								size={16}
								className={`transition-transform duration-200 ${openMenu === "direksiya" ? "rotate-180" : ""
									}`}
							/>
						</button>

						{/* Dropdown */}
						<div
							className={`absolute left-0 top-full bg-white border border-blue-200 shadow-xl rounded-lg w-64 transition-all duration-200 z-50 ${openMenu === "direksiya"
								? "opacity-100 visible translate-y-0"
								: "opacity-0 invisible -translate-y-2"
								}`}
						>
							<div className="p-2">
								<div className="text-xs font-semibold text-blue-700 uppercase tracking-wide px-3 py-2 border-b border-blue-100">
									{t.directorateSections}
								</div>
								<ul className="space-y-1 mt-1">
									{[
										{ path: "/about-us/team", text: t.team },
										{ path: "/about-us/public-services", text: t.services },
										{ path: "/about-us/international", text: t.international },
										{ path: "/about-us/charter", text: t.charter },
										{ path: "/about-us/tasks", text: t.tasks },
										{ path: "/about-us/government", text: t.leadership },
										{ path: "/about-us/structure", text: t.structure },
										{ path: "/about-us/details", text: t.details },
										{ path: "/about-us/employees", text: t.employees },
									].map((item, i) => (
										<li key={i}>
											<button
												onClick={() => handleNavigate(item.path)}
												className="flex items-center gap-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-3 py-2.5 transition-all duration-200 w-full text-left"
											>
												<div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
												{item.text}
											</button>
										</li>
									))}
								</ul>
							</div>
						</div>
					</li>

					{/* Urgut EIZ haqida */}
					<li
						className="relative"
						onMouseEnter={() => handleMouseEnter("haqida")}
						onMouseLeave={handleMouseLeave}
					>
						<button className="flex items-center gap-1 text-white hover:text-yellow-300 hover:bg-blue-600 transition-all duration-200 py-3 px-4 rounded-lg text-sm lg:text-base font-semibold">
							{t.about}
							<ChevronDown
								size={16}
								className={`transition-transform duration-200 ${openMenu === "haqida" ? "rotate-180" : ""
									}`}
							/>
						</button>

						<div
							className={`absolute left-0 top-full bg-white border border-blue-200 shadow-xl rounded-lg w-64 transition-all duration-200 z-50 ${openMenu === "haqida"
								? "opacity-100 visible translate-y-0"
								: "opacity-0 invisible -translate-y-2"
								}`}
						>
							<ul className="p-2 space-y-1">
								<li onClick={() => handleNavigate("/projects")} className="px-3 py-2.5 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600 cursor-pointer">{t.projects}</li>
								<li onClick={() => handleNavigate("/projects/completed")} className="px-3 py-2.5 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600 cursor-pointer">{t.completedProjects}</li>
								<li onClick={() => handleNavigate("/projects/ongoing")} className="px-3 py-2.5 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600 cursor-pointer">{t.ongoingProjects}</li>
								<li onClick={() => handleNavigate("/projects/offer")} className="px-3 py-2.5 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600 cursor-pointer">{t.offeredProjects}</li>
							</ul>
						</div>
					</li>

					<li>
						<button
							onClick={() => handleNavigate("/landarea")}
							className="text-white hover:text-yellow-300 hover:bg-blue-600 transition-all duration-200 py-3 px-4 rounded-lg text-sm lg:text-base font-semibold"
						>
							{t.landAreas}
						</button>
					</li>

					<li>
						<button
							onClick={() => handleNavigate("/membership")}
							className="text-white hover:text-yellow-300 hover:bg-blue-600 transition-all duration-200 py-3 px-4 rounded-lg text-sm lg:text-base font-semibold"
						>
							{t.membership}
						</button>
					</li>

					{/* Language Selector - Desktop */}
					<li className="relative" ref={desktopLangMenuRef}>
						<button
							onClick={toggleDesktopLangMenu}
							className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold shadow-md transition-all duration-300 focus:ring-2 focus:ring-blue-300 ml-2"
						>
							<img
								src={currentLang.flag}
								alt={currentLang.name}
								className="w-6 h-6 rounded-full border border-white/30"
							/>
							<span className="text-white hidden sm:inline">{currentLang.name}</span>
							<ChevronDown
								size={16}
								className={`text-white transition-transform duration-200 ${openDesktopLangMenu ? "rotate-180" : ""}`}
							/>
						</button>

						{/* Language Dropdown */}
						{openDesktopLangMenu && (
							<div className="absolute right-0 mt-2 w-44 bg-white text-gray-700 rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
								{languages.map((lang) => (
									<button
										key={lang.code}
										onClick={() => handleLanguageChange(lang)}
										className={`flex items-center gap-2 w-full px-3 py-2 text-left transition-all duration-200 ${language === lang.code
											? "bg-blue-600 text-white font-semibold"
											: "hover:bg-blue-100"
											}`}
									>
										<img
											src={lang.flag}
											alt={lang.name}
											className="w-5 h-5 rounded-full"
										/>
										<span>{lang.name}</span>
									</button>
								))}
							</div>
						)}
					</li>
				</ul>

				{/* Mobile Menu Button and Language Selector */}
				<div className="flex items-center gap-2 md:hidden">
					{/* Language Selector - Mobile */}
					<div className="relative" ref={mobileLangMenuRef}>
						<button
							onClick={toggleMobileLangMenu}
							className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-xl font-semibold shadow-md transition-all duration-300"
						>
							<img
								src={currentLang.flag}
								alt={currentLang.name}
								className="w-6 h-6 rounded-full border border-white/30"
							/>
							<ChevronDown
								size={16}
								className={`text-white transition-transform duration-200 ${openMobileLangMenu ? "rotate-180" : ""}`}
							/>
						</button>

						{/* Language Dropdown */}
						{openMobileLangMenu && (
							<div className="absolute right-0 mt-2 w-44 bg-white text-gray-700 rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
								{languages.map((lang) => (
									<button
										key={lang.code}
										onClick={() => handleLanguageChange(lang)}
										className={`flex items-center gap-2 w-full px-3 py-2 text-left transition-all duration-200 ${language === lang.code
											? "bg-blue-600 text-white font-semibold"
											: "hover:bg-blue-100"
											}`}
									>
										<img
											src={lang.flag}
											alt={lang.name}
											className="w-5 h-5 rounded-full"
										/>
										<span>{lang.name}</span>
									</button>
								))}
							</div>
						)}
					</div>

					{/* Mobile Menu Button */}
					<button
						className="p-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white hover:text-yellow-300 transition-all duration-200 shadow-md"
						onClick={() => setMobileOpen(!mobileOpen)}
					>
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							{mobileOpen ? (
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							) : (
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
							)}
						</svg>
					</button>
				</div>
			</div>

			{/* Mobile Dropdown */}
			<div
				className={`md:hidden bg-white shadow-xl border-t border-blue-200 transition-all duration-300 overflow-hidden ${mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
					}`}
			>
				<div className="p-4 space-y-1">
					<button onClick={() => handleNavigate("/")} className="block w-full text-left py-3 px-4 text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-semibold border-l-4 border-blue-500">
						{t.home}
					</button>

					{/* Direksiya Mobile */}
					<div className="border-t border-gray-100">
						<button
							onClick={() => toggleMenu("direksiya-mobile")}
							className="flex justify-between w-full items-center py-3 px-4 text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-semibold border-l-4 border-blue-500"
						>
							<span>{t.directorate}</span>
							<ChevronDown
								size={16}
								className={`transition-transform duration-200 ${openMenu === "direksiya-mobile" ? "rotate-180" : ""
									}`}
							/>
						</button>
						<div className={`overflow-hidden transition-all duration-300 ${openMenu === "direksiya-mobile" ? "max-h-96" : "max-h-0"}`}>
							<ul className="pl-6 pb-2 space-y-1">
								{[
									{ path: "/about-us/team", text: t.team },
									{ path: "/about-us/public-services", text: t.services },
									{ path: "/about-us/international", text: t.international },
									{ path: "/about-us/charter", text: t.charter },
									{ path: "/about-us/tasks", text: t.tasks },
									{ path: "/about-us/government", text: t.leadership },
									{ path: "/about-us/structure", text: t.structure },
									{ path: "/about-us/details", text: t.details },
									{ path: "/about-us/employees", text: t.employees },
								].map((item, index) => (
									<li key={index}>
										<button
											onClick={() => handleNavigate(item.path)}
											className="block w-full text-left py-2 px-4 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-all duration-200 ml-2 border-l-2 border-blue-200"
										>
											{item.text}
										</button>
									</li>
								))}
							</ul>
						</div>
					</div>

					{/* Haqida Mobile */}
					<div className="border-t border-gray-100">
						<button
							onClick={() => toggleMenu("haqida-mobile")}
							className="flex justify-between w-full items-center py-3 px-4 text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-semibold border-l-4 border-green-500"
						>
							<span>{t.about}</span>
							<ChevronDown
								size={16}
								className={`transition-transform duration-200 ${openMenu === "haqida-mobile" ? "rotate-180" : ""
									}`}
							/>
						</button>
						<div className={`overflow-hidden transition-all duration-300 ${openMenu === "haqida-mobile" ? "max-h-96" : "max-h-0"}`}>
							<ul className="pl-6 pb-2 space-y-1">
								<li onClick={() => handleNavigate("/projects")} className="py-2 px-4 text-gray-600 hover:bg-blue-50 rounded cursor-pointer">{t.projects}</li>
								<li onClick={() => handleNavigate("/projects/completed")} className="py-2 px-4 text-gray-600 hover:bg-blue-50 rounded cursor-pointer">{t.completedProjects}</li>
								<li onClick={() => handleNavigate("/projects/ongoing")} className="py-2 px-4 text-gray-600 hover:bg-blue-50 rounded cursor-pointer">{t.ongoingProjects}</li>
								<li onClick={() => handleNavigate("/projects/offer")} className="py-2 px-4 text-gray-600 hover:bg-blue-50 rounded cursor-pointer">{t.offeredProjects}</li>
							</ul>
						</div>
					</div>

					{/* Yer maydonlari */}
					<div className="border-t border-gray-100">
						<button onClick={() => handleNavigate("/landarea")} className="block w-full text-left py-3 px-4 text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-semibold border-l-4 border-yellow-500">
							{t.landAreas}
						</button>
					</div>

					{/* A'zolik */}
					<div className="border-t border-gray-100">
						<button onClick={() => handleNavigate("/membership")} className="block w-full text-left py-3 px-4 text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-semibold border-l-4 border-purple-500">
							{t.membership}
						</button>
					</div>
				</div>
			</div>
		</nav>
	)
}

export default Navbar