import axios from 'axios'
import { useEffect, useState } from 'react'

const AdminTeam = () => {
	const [leaders, setLeaders] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')

	// Form state for create/update
	const [formData, setFormData] = useState({
		fullName_uz: '',
		fullName_ru: '',
		fullName_en: '',
		position_uz: '',
		position_ru: '',
		position_en: '',
		phone: '',
		email: '',
		photo: null
	})

	const [editingId, setEditingId] = useState(null)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const baseURL = import.meta.env.VITE_BASE_URL

	// Fetch all leaders
	const fetchLeaders = async () => {
		setLoading(true)
		try {
			const response = await axios.get(`${baseURL}/api/leader/getAll`)
			// Xatolik chiqmasligi uchun leaders bo'sh bo'lsa ham ishlaydi
			setLeaders(response.data?.leaders || [])
			setError('')
		} catch (err) {
			console.error('Error fetching leaders:', err)
			// Faqat console da ko'rsatamiz, foydalanuvchiga ko'rinmasin
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchLeaders()
	}, [])

	// Handle form input changes
	const handleInputChange = (e) => {
		const { name, value } = e.target
		setFormData({
			...formData,
			[name]: value
		})
	}

	// Handle file input change
	const handleFileChange = (e) => {
		setFormData({
			...formData,
			photo: e.target.files[0]
		})
	}

	// Reset form
	const resetForm = () => {
		setFormData({
			fullName_uz: '',
			fullName_ru: '',
			fullName_en: '',
			position_uz: '',
			position_ru: '',
			position_en: '',
			phone: '',
			email: '',
			photo: null
		})
		setEditingId(null)
	}

	// Create new leader
	const handleCreate = async (e) => {
		e.preventDefault()
		setLoading(true)

		try {
			const formDataToSend = new FormData()
			Object.keys(formData).forEach(key => {
				if (formData[key] !== null) {
					formDataToSend.append(key, formData[key])
				}
			})

			await axios.post(`${baseURL}/api/leader/create`, formDataToSend, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})

			setSuccess('Rahbar muvaffaqiyatli qo\'shildi')
			resetForm()
			setIsModalOpen(false)
			fetchLeaders()
		} catch (err) {
			setError('Rahbar qo\'shishda xatolik yuz berdi')
			console.error('Error creating leader:', err)
		} finally {
			setLoading(false)
		}
	}

	// Update leader
	const handleUpdate = async (e) => {
		e.preventDefault()
		setLoading(true)

		try {
			const formDataToSend = new FormData()
			Object.keys(formData).forEach(key => {
				if (formData[key] !== null) {
					formDataToSend.append(key, formData[key])
				}
			})

			await axios.put(`${baseURL}/api/leader/update/${editingId}`, formDataToSend, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})

			setSuccess('Rahbar muvaffaqiyatli yangilandi')
			resetForm()
			setIsModalOpen(false)
			fetchLeaders()
		} catch (err) {
			setError('Rahbarni yangilashda xatolik yuz berdi')
			console.error('Error updating leader:', err)
		} finally {
			setLoading(false)
		}
	}

	// Delete leader
	const handleDelete = async (id) => {
		if (!window.confirm('Haqiqatan ham ushbu rahbarni o\'chirmoqchimisiz?')) {
			return
		}

		setLoading(true)
		try {
			await axios.delete(`${baseURL}/api/leader/delete/${id}`)
			setSuccess('Rahbar muvaffaqiyatli o\'chirildi')
			fetchLeaders()
		} catch (err) {
			setError('Rahbarni o\'chirishda xatolik yuz berdi')
			console.error('Error deleting leader:', err)
		} finally {
			setLoading(false)
		}
	}

	// Edit leader - populate form with existing data
	const handleEdit = (leader) => {
		setFormData({
			fullName_uz: leader.fullName_uz,
			fullName_ru: leader.fullName_ru,
			fullName_en: leader.fullName_en,
			position_uz: leader.position_uz,
			position_ru: leader.position_ru,
			position_en: leader.position_en,
			phone: leader.phone,
			email: leader.email,
			photo: null // Don't pre-fill the file input
		})
		setEditingId(leader._id)
		setIsModalOpen(true)
	}

	// Open modal for creating new leader
	const openCreateModal = () => {
		resetForm()
		setIsModalOpen(true)
	}

	// Close modal
	const closeModal = () => {
		setIsModalOpen(false)
		resetForm()
	}

	// Clear messages after 3 seconds
	useEffect(() => {
		if (success || error) {
			const timer = setTimeout(() => {
				setSuccess('')
				setError('')
			}, 3000)
			return () => clearTimeout(timer)
		}
	}, [success, error])

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
			<div className="mx-auto">
				{/* Header */}
				<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
					<div className="mb-6 lg:mb-0">
						<h1 className="text-3xl font-bold text-gray-800 mb-2">
							Rahbarlar Boshqaruvi
						</h1>
					</div>
					<button
						className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center space-x-2"
						onClick={openCreateModal}
						disabled={loading}
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
						</svg>
						<span>Yangi Rahbar Qo'shish</span>
					</button>
				</div>

				{/* Success/Error Messages */}
				{success && (
					<div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg shadow-sm">
						<div className="flex items-center">
							<svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
							</svg>
							<span className="text-green-700 font-medium">{success}</span>
						</div>
					</div>
				)}
				{error && (
					<div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-sm">
						<div className="flex items-center">
							<svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
							</svg>
							<span className="text-red-700 font-medium">{error}</span>
						</div>
					</div>
				)}

				{/* Loading Indicator */}
				{loading && (
					<div className="flex justify-center items-center p-12 bg-white rounded-2xl shadow-lg mb-6">
						<div className="flex flex-col items-center space-y-4">
							<div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
							<span className="text-gray-600 font-medium">Ma'lumotlar yuklanmoqda...</span>
						</div>
					</div>
				)}

				{/* Leaders Table */}
				<div className="bg-white rounded-2xl shadow-xl overflow-hidden">
					{leaders.length > 0 ? (
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gradient-to-r from-gray-50 to-blue-50">
									<tr>
										<th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
											Rasm
										</th>
										<th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
											Ism (UZ)
										</th>
										<th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
											Lavozim (UZ)
										</th>
										<th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
											Telefon
										</th>
										<th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
											Email
										</th>
										<th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
											Amallar
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{leaders.map(leader => (
										<tr key={leader._id} className="hover:bg-blue-50 transition-colors duration-200">
											<td className="px-8 py-4 whitespace-nowrap">
												{leader.photo && (
													<div className="relative">
														<img
															src={`${baseURL}${leader.photo}`}
															alt={leader.fullName_uz}
															className="w-14 h-14 rounded-xl object-cover shadow-md border-2 border-white"
														/>
														<div className="absolute inset-0 rounded-xl border-2 border-blue-200 opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
													</div>
												)}
											</td>
											<td className="px-8 py-4 whitespace-nowrap">
												<div>
													<div className="text-sm font-semibold text-gray-900">{leader.fullName_uz}</div>
													<div className="text-xs text-gray-500 mt-1">
														{leader.fullName_ru} / {leader.fullName_en}
													</div>
												</div>
											</td>
											<td className="px-8 py-4 whitespace-nowrap">
												<div>
													<div className="text-sm font-medium text-gray-900">{leader.position_uz}</div>
													<div className="text-xs text-gray-500 mt-1">
														{leader.position_ru} / {leader.position_en}
													</div>
												</div>
											</td>
											<td className="px-8 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
												{leader.phone}
											</td>
											<td className="px-8 py-4 whitespace-nowrap text-sm text-gray-900">
												{leader.email}
											</td>
											<td className="px-8 py-4 whitespace-nowrap text-sm font-medium">
												<div className="flex space-x-3">
													<button
														className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center space-x-2"
														onClick={() => handleEdit(leader)}
														disabled={loading}
													>
														<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
														</svg>
														<span>Tahrirlash</span>
													</button>
													<button
														className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center space-x-2"
														onClick={() => handleDelete(leader._id)}
														disabled={loading}
													>
														<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
														</svg>
														<span>O'chirish</span>
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						// Empty State
						<div className="text-center py-16 px-6">
							<div className="max-w-md mx-auto">
								<div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
									<svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
									</svg>
								</div>
								<h3 className="text-xl font-semibold text-gray-700 mb-2">Hech qanday rahbar topilmadi</h3>
								<p className="text-gray-500 mb-6">Hozircha jamoangizda rahbarlar mavjud emas. Birinchi rahbarni qo'shing!</p>
								<button
									className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center space-x-2"
									onClick={openCreateModal}
								>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
									</svg>
									<span>Birinchi Rahbarni Qo'shish</span>
								</button>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Create/Edit Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
					<div
						className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform animate-slideUp"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Modal Header */}
						<div className="flex justify-between items-center p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-3xl">
							<div>
								<h2 className="text-2xl font-bold text-gray-800">
									{editingId ? 'Rahbarni Tahrirlash' : 'Yangi Rahbar Qo\'shish'}
								</h2>
								<p className="text-gray-600 mt-1">
									{editingId ? 'Rahbar ma\'lumotlarini yangilang' : 'Yangi rahbar ma\'lumotlarini kiriting'}
								</p>
							</div>
							<button
								className="text-gray-400 hover:text-gray-600 text-2xl font-light bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
								onClick={closeModal}
							>
								×
							</button>
						</div>

						{/* Modal Form */}
						<form onSubmit={editingId ? handleUpdate : handleCreate} className="p-8">
							<div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
								{/* Uzbek Fields */}
								<div className="space-y-6">
									<div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-2xl">
										<h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
											<span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
											O'zbekcha Ma'lumotlar
										</h3>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Ism (O'zbekcha)
											</label>
											<input
												type="text"
												name="fullName_uz"
												value={formData.fullName_uz}
												onChange={handleInputChange}
												required
												placeholder="To'liq ism kiriting"
												className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Lavozim (O'zbekcha)
											</label>
											<input
												type="text"
												name="position_uz"
												value={formData.position_uz}
												onChange={handleInputChange}
												required
												placeholder="Lavozimni kiriting"
												className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
											/>
										</div>
									</div>

									{/* Russian Fields */}
									<div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-2xl">
										<h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
											<span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
											Ruscha Ma'lumotlar
										</h3>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Ism (Ruscha)
											</label>
											<input
												type="text"
												name="fullName_ru"
												value={formData.fullName_ru}
												onChange={handleInputChange}
												required
												placeholder="Введите полное имя"
												className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Lavozim (Ruscha)
											</label>
											<input
												type="text"
												name="position_ru"
												value={formData.position_ru}
												onChange={handleInputChange}
												required
												placeholder="Введите должность"
												className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white"
											/>
										</div>
									</div>
								</div>

								<div className="space-y-6">
									{/* English Fields */}
									<div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-2xl">
										<h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
											<span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
											Inglizcha Ma'lumotlar
										</h3>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Ism (Inglizcha)
											</label>
											<input
												type="text"
												name="fullName_en"
												value={formData.fullName_en}
												onChange={handleInputChange}
												required
												placeholder="Enter full name"
												className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Lavozim (Inglizcha)
											</label>
											<input
												type="text"
												name="position_en"
												value={formData.position_en}
												onChange={handleInputChange}
												required
												placeholder="Enter position"
												className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
											/>
										</div>
									</div>

									{/* Contact Information */}
									<div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-2xl">
										<h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
											<span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
											Aloqa Ma'lumotlari
										</h3>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Telefon
											</label>
											<input
												type="tel"
												name="phone"
												value={formData.phone}
												onChange={handleInputChange}
												required
												placeholder="+998 XX XXX XX XX"
												className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Email
											</label>
											<input
												type="email"
												name="email"
												value={formData.email}
												onChange={handleInputChange}
												required
												placeholder="email@example.com"
												className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white"
											/>
										</div>
									</div>
								</div>
							</div>

							{/* File Upload */}
							<div className="mb-8">
								<label className="block text-sm font-medium text-gray-700 mb-3">
									Rasm Yuklash
								</label>
								<div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-all duration-200 bg-gray-50">
									<input
										type="file"
										name="photo"
										onChange={handleFileChange}
										accept="image/*"
										required={!editingId}
										className="hidden"
										id="file-upload"
									/>
									<label htmlFor="file-upload" className="cursor-pointer">
										<svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
										</svg>
										<p className="text-gray-600 mb-2">
											{formData.photo ? formData.photo.name : 'Rasmni yuklash uchun bosing'}
										</p>
										<p className="text-sm text-gray-500">
											PNG, JPG, JPEG (Max: 5MB)
										</p>
									</label>
								</div>
								{editingId && (
									<p className="mt-3 text-sm text-gray-500 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
										Agar rasmni o'zgartirmoqchi bo'lmasangiz, bu maydonni bo'sh qoldiring
									</p>
								)}
							</div>

							{/* Modal Actions */}
							<div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
								<button
									type="button"
									className="px-8 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
									onClick={closeModal}
									disabled={loading}
								>
									Bekor qilish
								</button>
								<button
									type="submit"
									className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center space-x-2"
									disabled={loading}
								>
									{loading ? (
										<>
											<div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
											<span>Saqlanmoqda...</span>
										</>
									) : (
										<>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
											</svg>
											<span>{editingId ? 'Yangilash' : 'Qo\'shish'}</span>
										</>
									)}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Custom Animations */}
			<style jsx>{`
				@keyframes fadeIn {
					from { opacity: 0; }
					to { opacity: 1; }
				}
				@keyframes slideUp {
					from { 
						opacity: 0;
						transform: translateY(20px);
					}
					to { 
						opacity: 1;
						transform: translateY(0);
					}
				}
				.animate-fadeIn {
					animation: fadeIn 0.3s ease-out;
				}
				.animate-slideUp {
					animation: slideUp 0.4s ease-out;
				}
			`}</style>
		</div>
	)
}

export default AdminTeam