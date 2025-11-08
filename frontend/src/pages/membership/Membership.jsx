import Footer from "../component/Footer"
import Navbar from "../component/Navbar"

const Membership = () => {
	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			{/* 🔹 Tepada Navbar */}
			<Navbar />

			{/* 🔹 Asosiy kontent */}
			<main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
				{/* 🔹 Rasm joylashuvi */}
				<div className="w-full max-w-5xl flex justify-center">
					<img
						src="/azolik.png"
						alt="A’zolik tartibi"
						className="w-full rounded-2xl shadow-lg border border-gray-200"
					/>
				</div>
			</main>

			{/* 🔹 Pastda Footer */}
			<Footer />
		</div>
	)
}

export default Membership
