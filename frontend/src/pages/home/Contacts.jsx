import axios from 'axios'
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react"
import { useEffect, useState } from "react"

const Contacts = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		message: ""
	})
	const [loading, setLoading] = useState(false)
	const [submitStatus, setSubmitStatus] = useState(null)
	const [language, setLanguage] = useState("uz")
	const BASE_URL = import.meta.env.VITE_BASE_URL

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
			title: "Biz bilan bog'laning",
			contactInfo: "Aloqa ma'lumotlari",
			address: "Manzil",
			phone: "Telefon",
			email: "Email",
			workTime: "Ish vaqti",
			location: "Joylashuv",
			proposals: "Taklif va murojaatlar",
			name: "Ismingiz *",
			namePlaceholder: "Ismingizni kiriting",
			emailPlaceholder: "email@example.com",
			phonePlaceholder: "+998 (XX) XXX-XX-XX",
			message: "Xabaringiz *",
			messagePlaceholder: "Xabaringizni bu yerda yozing...",
			sendButton: "Xabarni yuborish",
			sending: "Yuborilmoqda...",
			requiredFields: "* bilan belgilangan maydonlar to'ldirilishi shart",
			addressText: "Urganch shahri, Al-Xorazmiy ko'chasi 15",
			phoneNumbers: ["+998 (71) 200-00-00", "+998 (71) 200-00-01"],
			emails: ["info@ufez.uz", "invest@ufez.uz"],
			workSchedule: [
				"Dushanba - Juma: 9:00 - 18:00",
				"Shanba: 9:00 - 14:00",
				"Yakshanba: Dam olish kuni"
			],
			locationText: "Urgut erkin iqtisodiy zona Direktsiyasi",
			successMessage: "Arizangiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog'lanamiz.",
			errorMessage: "Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring."
		},
		ru: {
			title: "Свяжитесь с нами",
			contactInfo: "Контактная информация",
			address: "Адрес",
			phone: "Телефон",
			email: "Email",
			workTime: "Время работы",
			location: "Местоположение",
			proposals: "Предложения и обращения",
			name: "Ваше имя *",
			namePlaceholder: "Введите ваше имя",
			emailPlaceholder: "email@example.com",
			phonePlaceholder: "+998 (XX) XXX-XX-XX",
			message: "Ваше сообщение *",
			messagePlaceholder: "Напишите ваше сообщение здесь...",
			sendButton: "Отправить сообщение",
			sending: "Отправляется...",
			requiredFields: "* отмеченные поля обязательны для заполнения",
			addressText: "г. Ургенч, ул. Аль-Хорезми 15",
			phoneNumbers: ["+998 (71) 200-00-00", "+998 (71) 200-00-01"],
			emails: ["info@ufez.uz", "invest@ufez.uz"],
			workSchedule: [
				"Понедельник - Пятница: 9:00 - 18:00",
				"Суббота: 9:00 - 14:00",
				"Воскресенье: Выходной"
			],
			locationText: "Дирекция Ургутской свободной экономической зоны",
			successMessage: "Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.",
			errorMessage: "Произошла ошибка. Пожалуйста, попробуйте еще раз."
		},
		en: {
			title: "Contact Us",
			contactInfo: "Contact Information",
			address: "Address",
			phone: "Phone",
			email: "Email",
			workTime: "Working Hours",
			location: "Location",
			proposals: "Proposals and Inquiries",
			name: "Your Name *",
			namePlaceholder: "Enter your name",
			emailPlaceholder: "email@example.com",
			phonePlaceholder: "+998 (XX) XXX-XX-XX",
			message: "Your Message *",
			messagePlaceholder: "Write your message here...",
			sendButton: "Send Message",
			sending: "Sending...",
			requiredFields: "* marked fields are required",
			addressText: "Urgench city, Al-Khorezmi street 15",
			phoneNumbers: ["+998 (71) 200-00-00", "+998 (71) 200-00-01"],
			emails: ["info@ufez.uz", "invest@ufez.uz"],
			workSchedule: [
				"Monday - Friday: 9:00 - 18:00",
				"Saturday: 9:00 - 14:00",
				"Sunday: Day off"
			],
			locationText: "Urgut Free Economic Zone Directorate",
			successMessage: "Your application has been sent successfully! We will contact you soon.",
			errorMessage: "An error occurred. Please try again."
		}
	}

	const t = translations[language] || translations.uz

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		})
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)
		setSubmitStatus(null)

		try {
			const response = await axios.post(`${BASE_URL}/api/application/create`, formData)

			if (response.data.success) {
				setSubmitStatus({
					type: 'success',
					message: response.data.message || t.successMessage
				})
				setFormData({ name: "", email: "", phone: "", message: "" })
			} else {
				setSubmitStatus({
					type: 'error',
					message: response.data.message || t.errorMessage
				})
			}
		} catch (error) {
			console.error("Form yuborishda xatolik:", error)
			setSubmitStatus({
				type: 'error',
				message: error.response?.data?.message || t.errorMessage
			})
		} finally {
			setLoading(false)
		}
	}

	return (
		<section id="contacts" className="py-20 bg-white">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				{/* Sarlavha */}
				<div className="text-center mb-16">
					<h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
						{t.title}
					</h2>
					<div className="w-24 h-1 bg-blue-500 mx-auto mb-6 rounded-full"></div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
					{/* Chap qism: Aloqa ma'lumotlari - 2/3 */}
					<div className="lg:col-span-2">
						<div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 h-full">
							<h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
								<div className="w-2 h-8 bg-blue-500 rounded-full"></div>
								{t.contactInfo}
							</h3>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
								{/* Manzil */}
								<div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
									<div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
										<MapPin className="w-6 h-6 text-white" />
									</div>
									<div>
										<h4 className="font-semibold text-gray-800 mb-1">{t.address}</h4>
										<p className="text-gray-600">{t.addressText}</p>
									</div>
								</div>

								{/* Telefon */}
								<div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
									<div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
										<Phone className="w-6 h-6 text-white" />
									</div>
									<div>
										<h4 className="font-semibold text-gray-800 mb-1">{t.phone}</h4>
										{t.phoneNumbers.map((number, index) => (
											<p key={index} className="text-gray-600">{number}</p>
										))}
									</div>
								</div>

								{/* Email */}
								<div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
									<div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
										<Mail className="w-6 h-6 text-white" />
									</div>
									<div>
										<h4 className="font-semibold text-gray-800 mb-1">{t.email}</h4>
										{t.emails.map((email, index) => (
											<p key={index} className="text-gray-600">{email}</p>
										))}
									</div>
								</div>

								{/* Ish vaqti */}
								<div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
									<div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
										<Clock className="w-6 h-6 text-white" />
									</div>
									<div>
										<h4 className="font-semibold text-gray-800 mb-1">{t.workTime}</h4>
										{t.workSchedule.map((schedule, index) => (
											<p key={index} className="text-gray-600">{schedule}</p>
										))}
									</div>
								</div>
							</div>

							<div className="mt-8">
								<h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
									<MapPin className="w-6 h-6 text-blue-500" />
									{t.location}
								</h4>

								{/* Xarita container */}
								<div className="relative bg-gray-100 rounded-2xl overflow-hidden shadow-xl border border-gray-300">
									<iframe
										src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3655.656222470923!2d67.18103327636484!3d39.42804671521907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f4cc5638540d5ad%3A0xc4b77b15748e6393!2sYangi%20Urgut%20Bozori%2C%20Samarqand%20viloyati%2C%20O%CA%BBzbekiston!5e1!3m2!1suz!2sus!4v1761916948718!5m2!1suz!2sus"
										width="100%"
										height="350"
										style={{ border: 0, minHeight: '350px' }}
										allowFullScreen=""
										loading="lazy"
										referrerPolicy="no-referrer-when-downgrade"
										title="Urgut EIZ Direksiyasi - Yangi Urgut Bozori"
										className="w-full"
									/>
								</div>

								{/* Manzil info */}
								<div className="mt-4 text-center">
									<div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-300 shadow-sm">
										<MapPin className="w-4 h-4 text-blue-500" />
										<span className="text-sm font-medium text-gray-700">
											{t.locationText}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* O'ng qism: Taklif va murojaatlar formasi - 1/3 */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 h-full">
							<h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
								<div className="w-2 h-8 bg-green-500 rounded-full"></div>
								{t.proposals}
							</h3>

							{/* Status xabari */}
							{submitStatus && (
								<div className={`mb-6 p-4 rounded-xl ${submitStatus.type === 'success'
									? 'bg-green-50 border border-green-200 text-green-700'
									: 'bg-red-50 border border-red-200 text-red-700'
									}`}>
									<div className="flex items-center gap-2">
										<div className={`w-3 h-3 rounded-full ${submitStatus.type === 'success' ? 'bg-green-500' : 'bg-red-500'
											}`}></div>
										<p className="text-sm font-medium">{submitStatus.message}</p>
									</div>
								</div>
							)}

							<form onSubmit={handleSubmit} className="space-y-6">
								{/* Ism */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										{t.name}
									</label>
									<input
										type="text"
										name="name"
										value={formData.name}
										onChange={handleChange}
										required
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
										placeholder={t.namePlaceholder}
										disabled={loading}
									/>
								</div>

								{/* Email */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										{t.email} *
									</label>
									<input
										type="email"
										name="email"
										value={formData.email}
										onChange={handleChange}
										required
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
										placeholder={t.emailPlaceholder}
										disabled={loading}
									/>
								</div>

								{/* Telefon */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										{t.phone}
									</label>
									<input
										type="tel"
										name="phone"
										value={formData.phone}
										onChange={handleChange}
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
										placeholder={t.phonePlaceholder}
										disabled={loading}
									/>
								</div>

								{/* Xabar */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										{t.message}
									</label>
									<textarea
										name="message"
										value={formData.message}
										onChange={handleChange}
										required
										rows={4}
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
										placeholder={t.messagePlaceholder}
										disabled={loading}
									/>
								</div>

								{/* Yuborish tugmasi */}
								<button
									type="submit"
									disabled={loading}
									className={`w-full font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
										} flex items-center justify-center gap-3 ${loading
											? 'bg-gray-400 text-white'
											: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
										}`}
								>
									{loading ? (
										<>
											<div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
											{t.sending}
										</>
									) : (
										<>
											<Send className="w-5 h-5" />
											{t.sendButton}
										</>
									)}
								</button>

								{/* Qo'shimcha ma'lumot */}
								<div className="text-center text-sm text-gray-500">
									{t.requiredFields}
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Contacts