import { useEffect, useState } from "react"

const QuikLinks = () => {
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
			title: "Rezidentlar"
		},
		ru: {
			title: "Резиденты"
		},
		en: {
			title: "Residents"
		}
	}

	const t = translations[language] || translations.uz

	const partners = [
		{ id: 1, name: "UzAuto Motors", logo: "rez1.png" },
		{ id: 2, name: "UzElectro", logo: "/rez2.jpg" },
		{ id: 3, name: "UzAuto Motors", logo: "rez3.png" },
		{ id: 4, name: "UzElectro", logo: "/rez4.jpg" },
		{ id: 5, name: "UzAuto Motors", logo: "rez5.png" },
		{ id: 6, name: "UzAuto Motors", logo: "rez6.png" },
		{ id: 7, name: "UzElectro", logo: "/rez7.jpg" },
		{ id: 8, name: "UzAuto Motors", logo: "rez8.png" },
		{ id: 9, name: "UzElectro", logo: "/rez9.jpg" },
		{ id: 10, name: "UzAuto Motors", logo: "rez10.png" },
		{ id: 11, name: "UzAuto Motors", logo: "rez11.png" },
		{ id: 12, name: "UzElectro", logo: "/rez12.jpg" },
		{ id: 13, name: "UzAuto Motors", logo: "rez13.png" },
		{ id: 14, name: "UzAuto Motors", logo: "rez14.png" },
		{ id: 15, name: "UzAuto Motors", logo: "rez15.png" },
		{ id: 16, name: "UzAuto Motors", logo: "rez16.png" },
		{ id: 17, name: "UzElectro", logo: "/rez17.jpg" },
		{ id: 18, name: "UzElectro", logo: "/rez18.jpg" },
		{ id: 19, name: "UzAuto Motors", logo: "rez19.png" },
		{ id: 20, name: "UzElectro", logo: "/rez20.jpg" },
		{ id: 21, name: "UzAuto Motors", logo: "rez21.png" },
		{ id: 22, name: "UzElectro", logo: "/rez22.jpg" },
		{ id: 23, name: "UzAuto Motors", logo: "rez23.png" },
		{ id: 24, name: "UzElectro", logo: "/rez24.jpg" },
		{ id: 25, name: "UzElectro", logo: "/rez25.jpg" },
		{ id: 26, name: "UzAuto Motors", logo: "rez26.png" },
		{ id: 27, name: "UzAuto Motors", logo: "rez27.png" },
		{ id: 28, name: "UzElectro", logo: "/rez28.jpg" },
	]

	// Massivni 2 marta takrorlaymiz (oxiri boshi bilan ulanadi)
	const infinitePartners = [...partners, ...partners]

	return (
		<section className="py-16 bg-white border-t border-gray-200 overflow-hidden">
			<div className="container mx-auto px-4">
				{/* Sarlavha */}
				<div className="text-center mb-8">
					<h2 className="text-3xl font-bold text-gray-800 mb-2">{t.title}</h2>
				</div>

				{/* Karusel */}
				<div className="relative w-full overflow-hidden">
					<div
						className="flex space-x-6 animate-scroll"
					>
						{infinitePartners.map((partner, index) => (
							<div
								key={`partner-${partner.id}-${index}`}
								className="flex-shrink-0 w-32 h-32 bg-white rounded-xl shadow-md border border-gray-200 flex items-center justify-center p-4 hover:shadow-lg hover:scale-105 transition-all duration-300"
							>
								<img
									src={partner.logo}
									alt={partner.name}
									className="max-w-full max-h-full object-contain"
								/>
							</div>
						))}
					</div>
				</div>

				{/* CSS */}
				<style jsx>{`
					@keyframes scroll {
						0% {
							transform: translateX(0);
						}
						100% {
							transform: translateX(-50%);
						}
					}
					.animate-scroll {
						display: flex;
						width: max-content;
						animation: scroll 40s linear infinite;
					}
				`}</style>
			</div>
		</section>
	)
}

export default QuikLinks