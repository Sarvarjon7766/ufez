import { Outlet } from "react-router-dom"
import Footer from "../component/Footer"
import Navbar from "../component/Navbar"
import Sitebar from "./Sitebar"

const ProjectsLayout = () => {
	return (
		<div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
			{/* 🔹 Navbar tepada qotib turadi */}
			<header className="sticky top-0 z-50 bg-white shadow-md">
				<Navbar />
			</header>

			{/* 🔹 Asosiy kontent qismi */}
			<div className="flex flex-1 flex-col md:flex-row container mx-auto px-4 py-6 gap-6">
				{/* 🔸 Sidebar */}
				<aside className="md:w-80 w-full md:sticky md:top-[72px] md:self-start bg-white rounded-2xl shadow-md border border-gray-200 p-5">
					<div className="max-h-[70vh] overflow-y-auto">
						<Sitebar />
					</div>
				</aside>

				{/* 🔸 Main kontent (Outlet orqali child sahifalar joylashadi) */}
				<main className="flex-1  p-6 overflow-auto">
					<Outlet />
				</main>
			</div>

			{/* 🔹 Footer */}
			<footer className="w-full bg-white border-t border-gray-200 shadow-inner">
				<Footer />
			</footer>
		</div>
	)
}

export default ProjectsLayout
