import {
	ChevronDown,
	Facebook,
	Instagram,
	Mail,
	MapPin,
	Phone,
	Send,
	Youtube,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

const TopNavbar = () => {
	const [language, setLanguage] = useState("uz")
	const [openLangMenu, setOpenLangMenu] = useState(false)
	const menuRef = useRef(null)

	// 🌍 Tillar ro‘yxati
	const languages = [
		{ code: "uz", name: "O'zbek", flag: "/uzbekistan.png" },
		{ code: "ru", name: "Русский", flag: "/russian.png" },
		{ code: "en", name: "English", flag: "/uk.png" },
	]

	// 🔹 Sahifa yuklanganda tilni localStorage’dan olish yoki 'uz' qilib saqlash
	useEffect(() => {
		const savedLang = localStorage.getItem("lang")
		if (savedLang) {
			setLanguage(savedLang)
		} else {
			localStorage.setItem("lang", "uz")
			setLanguage("uz")
		}

		const handleClickOutside = (e) => {
			if (menuRef.current && !menuRef.current.contains(e.target)) {
				setOpenLangMenu(false)
			}
		}
		document.addEventListener("mousedown", handleClickOutside)
		return () => document.removeEventListener("mousedown", handleClickOutside)
	}, [])

	// 🔹 Tilni o‘zgartirish funksiyasi
	const handleLanguageChange = (lang) => {
		setLanguage(lang.code)
		localStorage.setItem("lang", lang.code)
		setOpenLangMenu(false)
	}

	// 🔹 Hozirgi tilni aniqlash
	const currentLang =
		languages.find((l) => l.code === language) || languages[0]

	// 📞 Aloqa funksiyalari
	const handlePhoneClick = () => window.open("tel:+998664831108", "_self")
	const handleEmailClick = () =>
		window.open("mailto:info@zarafshon-irrigation.uz", "_self")
	const handleLocationClick = () =>
		window.open("https://maps.google.com/?q=Samarqand,+O%60zbekiston", "_blank")

	return (
		<div className="bg-transparent text-white text-xs sm:text-sm py-2 px-4 relative">
			<div className="px-6 py-2 mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
				{/* 🔹 Chap tomonda aloqa ma'lumotlari */}
				<div className="hidden sm:flex flex-wrap justify-center sm:justify-start items-center gap-4">
					<button
						onClick={handlePhoneClick}
						className="flex items-center gap-1 hover:bg-blue-600/30 px-2 py-1 rounded-md transition-all duration-200 group cursor-pointer"
					>
						<div className="bg-blue-500/20 p-1 rounded-full group-hover:bg-blue-400/40 transition-all">
							<Phone size={14} className="text-blue-300" />
						</div>
						<span className="group-hover:text-blue-200 transition-colors">
							+998 (66) 483-11-08
						</span>
					</button>

					<button
						onClick={handleEmailClick}
						className="hidden md:flex items-center gap-1 hover:bg-blue-600/30 px-2 py-1 rounded-md transition-all duration-200 group cursor-pointer"
					>
						<div className="bg-blue-500/20 p-1 rounded-full group-hover:bg-blue-400/40 transition-all">
							<Mail size={14} className="text-blue-300" />
						</div>
						<span className="group-hover:text-blue-200 transition-colors">
							info@zarafshon-irrigation.uz
						</span>
					</button>

					<button
						onClick={handleLocationClick}
						className="hidden lg:flex items-center gap-1 hover:bg-blue-600/30 px-2 py-1 rounded-md transition-all duration-200 group cursor-pointer"
					>
						<div className="bg-blue-500/20 p-1 rounded-full group-hover:bg-blue-400/40 transition-all">
							<MapPin size={14} className="text-blue-300" />
						</div>
						<span className="group-hover:text-blue-200 transition-colors">
							Samarqand viloyati, Zarafshon
						</span>
					</button>
				</div>

				{/* 🔹 O‘ng tomonda til tanlash va ijtimoiy tarmoqlar */}
				<div className="flex items-center justify-between w-full sm:w-auto gap-4">
					{/* 📞 Kichik ekranlarda telefon */}
					<div className="flex sm:hidden items-center gap-4">
						<button
							onClick={handlePhoneClick}
							className="flex items-center gap-1 hover:bg-blue-600/30 px-2 py-1 rounded-md transition-all duration-200 group cursor-pointer"
						>
							<div className="bg-blue-500/20 p-1 rounded-full group-hover:bg-blue-400/40 transition-all">
								<Phone size={14} className="text-blue-300" />
							</div>
							<span className="group-hover:text-blue-200 transition-colors">
								+998 (66) 483-11-08
							</span>
						</button>
					</div>

					{/* 🌍 Til tanlash */}
					<div className="relative" ref={menuRef}>
						<button
							onClick={() => setOpenLangMenu(!openLangMenu)}
							className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold shadow-md transition-all duration-300 focus:ring-2 focus:ring-blue-300"
						>
							<img
								src={currentLang.flag}
								alt={currentLang.name}
								className="w-6 h-6 rounded-full border border-white/30"
							/>
							<span className="text-white hidden sm:inline">{currentLang.name}</span>
							<ChevronDown size={16} className="text-white" />
						</button>

						{/* Dropdown menyu */}
						{openLangMenu && (
							<div className="absolute right-0 mt-2 w-44 bg-white text-gray-700 rounded-lg shadow-lg border border-gray-200 overflow-hidden z-51">
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

					{/* 🌐 Ijtimoiy tarmoqlar */}
					<div className="hidden sm:flex items-center gap-1">
						<a
							href="https://facebook.com"
							target="_blank"
							rel="noopener noreferrer"
							className="p-2 rounded-full bg-blue-600/30 hover:bg-blue-500/50 transition-all duration-300 group"
						>
							<Facebook size={16} className="text-blue-200 group-hover:text-white transition-colors" />
						</a>
						<a
							href="https://t.me/ufez_uz"
							target="_blank"
							rel="noopener noreferrer"
							className="p-2 rounded-full bg-blue-600/30 hover:bg-blue-500/50 transition-all duration-300 group"
						>
							<Send size={16} className="text-blue-200 group-hover:text-white transition-colors" />
						</a>
						<a
							href="https://youtube.com"
							target="_blank"
							rel="noopener noreferrer"
							className="p-2 rounded-full bg-blue-600/30 hover:bg-red-500/70 transition-all duration-300 group"
						>
							<Youtube size={16} className="text-blue-200 group-hover:text-white transition-colors" />
						</a>
						<a
							href="https://www.instagram.com/fezurgut/#"
							target="_blank"
							rel="noopener noreferrer"
							className="p-2 rounded-full bg-blue-600/30 hover:bg-pink-500/70 transition-all duration-300 group"
						>
							<Instagram size={16} className="text-blue-200 group-hover:text-white transition-colors" />
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}

export default TopNavbar
