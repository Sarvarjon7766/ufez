import { ChevronDown, ChevronRight, X } from "lucide-react"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"

const Sitebar = ({ isOpen, onClose }) => {
	const [openMenu, setOpenMenu] = useState(null)
	const location = useLocation() // 🔹 Hozirgi route

	const toggleMenu = (menu) => {
		setOpenMenu(openMenu === menu ? null : menu)
	}

	// 🔹 Link uchun active klass
	const isActive = (path) => location.pathname === path

	return (
		<>
			{/* 🔹 Mobil fon (overlay) */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-opacity-40 z-40 md:hidden"
					onClick={onClose}
				/>
			)}

			{/* 🔹 Sidebar */}
			<aside
				className={`fixed md:static top-0 left-0 h-full w-72 bg-gray-800 text-white flex flex-col z-50 transform transition-transform duration-300
				${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
			>
				{/* 🔸 Header */}
				<div className="flex items-center justify-between p-4 border-b border-gray-700">
					<button
						onClick={onClose}
						className="md:hidden p-1 rounded hover:bg-gray-700 transition"
					>
						<X size={22} />
					</button>
				</div>

				{/* 🔸 Menu List */}
				<nav className="flex-1 overflow-y-auto p-4 space-y-2">
					{/* 🏠 Home */}
					<div>
						<button
							onClick={() => toggleMenu("home")}
							className="flex justify-between items-center w-full text-left p-2 rounded hover:bg-gray-700"
						>
							<span>🏠 Home</span>
							{openMenu === "home" ? (
								<ChevronDown size={18} />
							) : (
								<ChevronRight size={18} />
							)}
						</button>
						{openMenu === "home" && (
							<div className="ml-4 mt-1 space-y-1">
								<Link
									to="/admin/banner"
									className={`block p-2 rounded hover:bg-gray-700 ${isActive("/admin/banner") ? "bg-blue-600" : ""
										}`}
								>
									📸 Banner
								</Link>
								<Link
									to="/admin/news"
									className={`block p-2 rounded hover:bg-gray-700 ${isActive("/admin/news") ? "bg-blue-600" : ""
										}`}
								>
									📰 Yangiliklar
								</Link>
								<Link
									to="/admin/question"
									className={`block p-2 rounded hover:bg-gray-700 ${isActive("/admin/question") ? "bg-blue-600" : ""
										}`}
								>
									❓ Ko‘p so‘raladigan
								</Link>
								<Link
									to="/admin/application"
									className={`block p-2 rounded hover:bg-gray-700 ${isActive("/admin/application") ? "bg-blue-600" : ""
										}`}
								>
									📨 Murojaatlar
								</Link>
							</div>
						)}
					</div>

					{/* 🏢 Urgut EIZ Direksiyasi */}
					<div>
						<button
							onClick={() => toggleMenu("direksiya")}
							className="flex justify-between items-center w-full text-left p-2 rounded hover:bg-gray-700"
						>
							<span>🏢 Urgut EIZ Direksiyasi</span>
							{openMenu === "direksiya" ? (
								<ChevronDown size={18} />
							) : (
								<ChevronRight size={18} />
							)}
						</button>
						{openMenu === "direksiya" && (
							<div className="ml-4 mt-1 space-y-1">
								<Link
									to="/admin/team"
									className={`block p-2 rounded hover:bg-gray-700 ${isActive("/admin/team") ? "bg-blue-600" : ""
										}`}
								>
									👨‍💼 Rahbariyat
								</Link>
								<Link
									to="/admin/public-service"
									className={`block p-2 rounded hover:bg-gray-700 ${isActive("/admin/public-service") ? "bg-blue-600" : ""
										}`}
								>
									🧾 Davlat xizmatlari ro‘yxati
								</Link>
								<Link
									to="/admin/internation-service"
									className={`block p-2 rounded hover:bg-gray-700 ${isActive("/admin/internation-service") ? "bg-blue-600" : ""
										}`}
								>
									🌍 Xalqaro aloqalar
								</Link>
								<Link
									to="/admin/charter"
									className={`block p-2 rounded hover:bg-gray-700 ${isActive("/admin/charter") ? "bg-blue-600" : ""
										}`}
								>
									📜 UrgutEIZ nizomi
								</Link>
								<Link
									to="/admin/task"
									className={`block p-2 rounded hover:bg-gray-700 ${isActive("/admin/task") ? "bg-blue-600" : ""
										}`}
								>
									🎯 Urgut EIZning vazifalari
								</Link>
								<Link
									to="/admin/e-government"
									className={`block p-2 rounded hover:bg-gray-700 ${isActive("/admin/e-government") ? "bg-blue-600" : ""
										}`}
								>
									💻 Elektron hukumat
								</Link>
								<Link
									to="/admin/structure"
									className={`block p-2 rounded hover:bg-gray-700 ${isActive("/admin/structure") ? "bg-blue-600" : ""
										}`}
								>
									🏗️ Tashkiliy tuzilma
								</Link>
								<Link
									to="/admin/rekvizit"
									className={`block p-2 rounded hover:bg-gray-700 ${isActive("/admin/rekvizit") ? "bg-blue-600" : ""
										}`}
								>
									🧾 Rekvizitlar
								</Link>
								<Link
									to="/admin/employer"
									className={`block p-2 rounded hover:bg-gray-700 ${isActive("/admin/employer") ? "bg-blue-600" : ""
										}`}
								>
									👥 Direksiya xodimlari
								</Link>
							</div>
						)}
					</div>

					{/* 🏗️ Urgut EIZ haqida */}
					<div>
						<button
							onClick={() => toggleMenu("haqida")}
							className="flex justify-between items-center w-full text-left p-2 rounded hover:bg-gray-700"
						>
							<span>🏗️ Urgut EIZ haqida</span>
							{openMenu === "haqida" ? (
								<ChevronDown size={18} />
							) : (
								<ChevronRight size={18} />
							)}
						</button>
						{openMenu === "haqida" && (
							<div className="ml-4 mt-1 space-y-1">
								<Link
									to="/admin/completed"
									className={`block p-2 rounded hover:bg-gray-700 ${isActive("/admin/completed") ? "bg-blue-600" : ""
										}`}
								>
									✅ Tugallangan loyihalar
								</Link>
								<Link
									to="/admin/ongoing"
									className={`block p-2 rounded hover:bg-gray-700 ${isActive("/admin/ongoing") ? "bg-blue-600" : ""
										}`}
								>
									⚙️ Amaldagi loyihalar
								</Link>
								<Link
									to="/admin/offer"
									className={`block p-2 rounded hover:bg-gray-700 ${isActive("/admin/offer") ? "bg-blue-600" : ""
										}`}
								>
									💡 Taklif etilayotgan loyihalar
								</Link>
							</div>
						)}
					</div>

					{/* 🌍 Yer maydonlari */}
					<Link
						to="/admin/land-area"
						className={`block hover:bg-gray-700 p-2 rounded transition ${isActive("/admin/land-area") ? "bg-blue-600" : ""
							}`}
						onClick={onClose}
					>
						🌍 Yer maydonlari
					</Link>

					{/* 🤝 A’zolik tartibi va afzalliklari */}
					<Link
						to="/admin/membership"
						className={`block hover:bg-gray-700 p-2 rounded transition ${isActive("/admin/membership") ? "bg-blue-600" : ""
							}`}
						onClick={onClose}
					>
						🤝 A’zolik tartibi va afzalliklari
					</Link>
				</nav>
			</aside>
		</>
	)
}

export default Sitebar
