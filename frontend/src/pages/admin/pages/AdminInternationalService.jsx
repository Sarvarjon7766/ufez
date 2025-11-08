import axios from 'axios'
import { useEffect, useState } from 'react'

const AdminInternationalService = () => {
	const [relations, setRelations] = useState([])
	const [filteredRelations, setFilteredRelations] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
	const [searchTerm, setSearchTerm] = useState('')

	// Form state for create/update
	const [formData, setFormData] = useState({
		title_uz: '',
		title_ru: '',
		title_en: '',
		description_uz: '',
		description_ru: '',
		description_en: '',
		photos: []
	})

	const [editingId, setEditingId] = useState(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [activeTab, setActiveTab] = useState('uz')
	const [deletedPhotos, setDeletedPhotos] = useState([])

	const baseURL = import.meta.env.VITE_BASE_URL

	// Fetch all relations
	const fetchRelations = async () => {
		setLoading(true)
		try {
			const response = await axios.get(`${baseURL}/api/relation/getAll`)
			setRelations(response.data?.relations || [])
			setFilteredRelations(response.data?.relations || [])
			setError('')
		} catch (err) {
			console.error('Error fetching relations:', err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchRelations()
	}, [])

	// Search functionality
	useEffect(() => {
		if (searchTerm.trim() === '') {
			setFilteredRelations(relations)
		} else {
			const filtered = relations.filter(relation =>
				relation.title_uz.toLowerCase().includes(searchTerm.toLowerCase()) ||
				relation.title_ru.toLowerCase().includes(searchTerm.toLowerCase()) ||
				relation.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
				relation.description_uz.toLowerCase().includes(searchTerm.toLowerCase()) ||
				relation.description_ru.toLowerCase().includes(searchTerm.toLowerCase()) ||
				relation.description_en.toLowerCase().includes(searchTerm.toLowerCase())
			)
			setFilteredRelations(filtered)
		}
	}, [searchTerm, relations])

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
		const files = Array.from(e.target.files)
		setFormData({
			...formData,
			photos: [...formData.photos, ...files]
		})
	}

	// Remove photo from form (for new photos)
	const removeNewPhoto = (index) => {
		const newPhotos = formData.photos.filter((_, i) => i !== index)
		setFormData({
			...formData,
			photos: newPhotos
		})
	}

	// Remove existing photo (mark for deletion)
	const removeExistingPhoto = (photoUrl) => {
		setDeletedPhotos([...deletedPhotos, photoUrl])
		const currentPhotos = Array.isArray(formData.existingPhotos) ? formData.existingPhotos : []
		const updatedPhotos = currentPhotos.filter(photo => photo !== photoUrl)
		setFormData({
			...formData,
			existingPhotos: updatedPhotos
		})
	}

	// Reset form
	const resetForm = () => {
		setFormData({
			title_uz: '',
			title_ru: '',
			title_en: '',
			description_uz: '',
			description_ru: '',
			description_en: '',
			photos: [],
			existingPhotos: []
		})
		setEditingId(null)
		setActiveTab('uz')
		setDeletedPhotos([])
	}

	// Create new relation
	const handleCreate = async (e) => {
		e.preventDefault()
		setLoading(true)

		try {
			const formDataToSend = new FormData()

			// Add text fields
			formDataToSend.append('title_uz', formData.title_uz)
			formDataToSend.append('title_ru', formData.title_ru)
			formDataToSend.append('title_en', formData.title_en)
			formDataToSend.append('description_uz', formData.description_uz)
			formDataToSend.append('description_ru', formData.description_ru)
			formDataToSend.append('description_en', formData.description_en)

			// Add photos
			formData.photos.forEach(photo => {
				formDataToSend.append('photos', photo)
			})

			await axios.post(`${baseURL}/api/relation/create`, formDataToSend, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})

			setSuccess('Xalqaro aloqa muvaffaqiyatli qo\'shildi')
			resetForm()
			setIsModalOpen(false)
			fetchRelations()
		} catch (err) {
			setError('Xalqaro aloqa qo\'shishda xatolik yuz berdi')
			console.error('Error creating relation:', err)
		} finally {
			setLoading(false)
		}
	}

	// Update relation
	const handleUpdate = async (e) => {
		e.preventDefault()
		setLoading(true)

		try {
			const formDataToSend = new FormData()

			// Add text fields
			formDataToSend.append('title_uz', formData.title_uz)
			formDataToSend.append('title_ru', formData.title_ru)
			formDataToSend.append('title_en', formData.title_en)
			formDataToSend.append('description_uz', formData.description_uz)
			formDataToSend.append('description_ru', formData.description_ru)
			formDataToSend.append('description_en', formData.description_en)

			// Add new photos
			formData.photos.forEach(photo => {
				formDataToSend.append('photos', photo)
			})

			// Add deleted photos
			deletedPhotos.forEach(photoUrl => {
				formDataToSend.append('deletedPhotos', photoUrl)
			})

			await axios.put(`${baseURL}/api/relation/update/${editingId}`, formDataToSend, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})

			setSuccess('Xalqaro aloqa muvaffaqiyatli yangilandi')
			resetForm()
			setIsModalOpen(false)
			fetchRelations()
		} catch (err) {
			setError('Xalqaro aloqani yangilashda xatolik yuz berdi')
			console.error('Error updating relation:', err)
		} finally {
			setLoading(false)
		}
	}

	// Delete relation
	const handleDelete = async (id) => {
		if (!window.confirm('Haqiqatan ham ushbu xalqaro aloqani o\'chirmoqchimisiz?')) {
			return
		}

		setLoading(true)
		try {
			await axios.delete(`${baseURL}/api/relation/delete/${id}`)
			setSuccess('Xalqaro aloqa muvaffaqiyatli o\'chirildi')
			fetchRelations()
		} catch (err) {
			setError('Xalqaro aloqani o\'chirishda xatolik yuz berdi')
			console.error('Error deleting relation:', err)
		} finally {
			setLoading(false)
		}
	}

	// Edit relation - populate form with existing data
	const handleEdit = (relation) => {
		setFormData({
			title_uz: relation.title_uz,
			title_ru: relation.title_ru,
			title_en: relation.title_en,
			description_uz: relation.description_uz,
			description_ru: relation.description_ru,
			description_en: relation.description_en,
			photos: [],
			existingPhotos: relation.photos || []
		})
		setEditingId(relation._id)
		setDeletedPhotos([])
		setIsModalOpen(true)
	}

	// Open modal for creating new relation
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

	// Truncate text for table view
	const truncateText = (text, length = 50) => {
		if (!text) return ''
		if (text.length <= length) return text
		return text.substring(0, length) + '...'
	}

	// Get photo preview URL
	const getPhotoPreview = (photo) => {
		if (typeof photo === 'string') {
			return `${baseURL}${photo}`
		}
		return URL.createObjectURL(photo)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
			<div className="mx-auto">
				{/* Header */}
				<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
					<div className="mb-6 lg:mb-0">
						<h1 className="text-3xl font-bold text-gray-800 mb-2">
							Xalqaro Aloqalar Boshqaruvi
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
						<span>Qo'shish</span>
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

				{/* Search Box */}
				<div className="mb-6">
					<div className="relative max-w-md">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
						</div>
						<input
							type="text"
							placeholder="Xalqaro aloqalarni qidirish..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="block w-full text-black pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
						/>
						{searchTerm && (
							<button
								onClick={() => setSearchTerm('')}
								className="absolute inset-y-0 right-0 pr-3 flex items-center"
							>
								<svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						)}
					</div>
				</div>

				{/* Loading Indicator */}
				{loading && (
					<div className="flex justify-center items-center p-12 bg-white rounded-2xl shadow-lg mb-6">
						<div className="flex flex-col items-center space-y-4">
							<div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
							<span className="text-gray-600 font-medium">Ma'lumotlar yuklanmoqda...</span>
						</div>
					</div>
				)}

				{/* Relations Table (Desktop) */}
				<div className="hidden lg:block bg-white rounded-2xl shadow-lg overflow-hidden">
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gradient-to-r from-gray-50 to-blue-50">
								<tr>
									<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[150px]">
										Sarlavha (UZ)
									</th>
									<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[150px]">
										Sarlavha (RU)
									</th>
									<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[150px]">
										Sarlavha (EN)
									</th>
									<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[200px] max-w-[300px]">
										Tavsif
									</th>
									<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[100px]">
										Rasmlar
									</th>
									<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[140px]">
										Amallar
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredRelations.length > 0 ? (
									filteredRelations.map(relation => (
										<tr key={relation._id} className="hover:bg-blue-50 transition-colors duration-200">
											{/* Title UZ */}
											<td className="px-4 py-3">
												<div className="text-sm font-medium text-gray-900 break-words min-w-[150px] max-w-[200px]">
													{relation.title_uz}
												</div>
											</td>

											{/* Title RU */}
											<td className="px-4 py-3">
												<div className="text-sm text-gray-900 break-words min-w-[150px] max-w-[200px]">
													{relation.title_ru}
												</div>
											</td>

											{/* Title EN */}
											<td className="px-4 py-3">
												<div className="text-sm text-gray-900 break-words min-w-[150px] max-w-[200px]">
													{relation.title_en}
												</div>
											</td>

											{/* Description */}
											<td className="px-4 py-3">
												<div className="group relative">
													<div className="text-sm text-gray-600 break-words min-w-[200px] max-w-[300px] line-clamp-2">
														{truncateText(relation.description_uz, 80)}
													</div>
													{relation.description_uz && relation.description_uz.length > 80 && (
														<div className="absolute invisible group-hover:visible z-10 bottom-full left-0 mb-2 w-80 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg">
															<div className="font-medium mb-1">To'liq tavsif:</div>
															{relation.description_uz}
															<div className="absolute top-full left-4 border-4 border-transparent border-t-gray-900"></div>
														</div>
													)}
												</div>
											</td>

											{/* Photos */}
											<td className="px-4 py-3">
												<div className="flex flex-wrap gap-1">
													{relation.photos?.slice(0, 3).map((photo, index) => (
														<img
															key={index}
															src={`${baseURL}${photo}`}
															alt={`Rasm ${index + 1}`}
															className="w-8 h-8 rounded object-cover"
														/>
													))}
													{relation.photos?.length > 3 && (
														<div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-600">
															+{relation.photos.length - 3}
														</div>
													)}
												</div>
											</td>

											{/* Actions */}
											<td className="px-4 py-3 whitespace-nowrap">
												<div className="flex space-x-2 min-w-[140px]">
													<button
														className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow flex items-center space-x-2 flex-1 justify-center"
														onClick={() => handleEdit(relation)}
														disabled={loading}
													>
														<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
														</svg>
														<span className="text-xs">Tahrir</span>
													</button>
													<button
														className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow flex items-center space-x-2 flex-1 justify-center"
														onClick={() => handleDelete(relation._id)}
														disabled={loading}
													>
														<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
														</svg>
														<span className="text-xs">O'chirish</span>
													</button>
												</div>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
											{searchTerm ? 'Qidiruv bo\'yicha hech narsa topilmadi' : 'Hech qanday xalqaro aloqa topilmadi'}
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* Relations Cards (Mobile) */}
				<div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
					{filteredRelations.length > 0 ? (
						filteredRelations.map(relation => (
							<div key={relation._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
								<div className="p-6">
									<div className="flex items-start justify-between mb-4">
										<div className="flex-1">
											<h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
												{relation.title_uz}
											</h3>
										</div>
										<div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
											{relation.title_uz?.charAt(0) || 'X'}
										</div>
									</div>

									<p className="text-gray-600 mb-4 line-clamp-3">
										{relation.description_uz}
									</p>

									{/* Photos Preview */}
									{relation.photos && relation.photos.length > 0 && (
										<div className="mb-4">
											<div className="flex flex-wrap gap-2">
												{relation.photos.slice(0, 4).map((photo, index) => (
													<img
														key={index}
														src={`${baseURL}${photo}`}
														alt={`Rasm ${index + 1}`}
														className="w-12 h-12 rounded-lg object-cover"
													/>
												))}
												{relation.photos.length > 4 && (
													<div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-600">
														+{relation.photos.length - 4}
													</div>
												)}
											</div>
										</div>
									)}

									{/* Language Tabs */}
									<div className="mb-4">
										<div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
											{['uz', 'ru', 'en'].map(lang => (
												<button
													key={lang}
													className={`flex-1 py-1 px-2 text-xs font-medium rounded-md transition-colors ${activeTab === lang
														? 'bg-white text-blue-600 shadow-sm'
														: 'text-gray-600 hover:text-gray-800'
														}`}
													onClick={() => setActiveTab(lang)}
												>
													{lang.toUpperCase()}
												</button>
											))}
										</div>

										<div className="mt-3 text-sm">
											<div className={activeTab === 'uz' ? 'block' : 'hidden'}>
												<strong className="text-gray-800">{relation.title_uz}</strong>
												<p className="text-gray-600 mt-1">{relation.description_uz}</p>
											</div>
											<div className={activeTab === 'ru' ? 'block' : 'hidden'}>
												<strong className="text-gray-800">{relation.title_ru}</strong>
												<p className="text-gray-600 mt-1">{relation.description_ru}</p>
											</div>
											<div className={activeTab === 'en' ? 'block' : 'hidden'}>
												<strong className="text-gray-800">{relation.title_en}</strong>
												<p className="text-gray-600 mt-1">{relation.description_en}</p>
											</div>
										</div>
									</div>

									{/* Actions */}
									<div className="flex space-x-2 pt-4 border-t border-gray-200">
										<button
											className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center space-x-2"
											onClick={() => handleEdit(relation)}
											disabled={loading}
										>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
											</svg>
											<span>Tahrirlash</span>
										</button>
										<button
											className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center space-x-2"
											onClick={() => handleDelete(relation._id)}
											disabled={loading}
										>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
											</svg>
											<span>O'chirish</span>
										</button>
									</div>
								</div>
							</div>
						))
					) : (
						// Empty State
						<div className="col-span-full text-center py-16 px-6 bg-white rounded-2xl shadow-lg">
							<div className="max-w-md mx-auto">
								<div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
									<svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
									</svg>
								</div>
								<h3 className="text-xl font-semibold text-gray-700 mb-2">
									{searchTerm ? 'Qidiruv bo\'yicha hech narsa topilmadi' : 'Hech qanday xalqaro aloqa topilmadi'}
								</h3>
								<p className="text-gray-500 mb-6">
									{searchTerm ? 'Boshqa so\'zlar bilan qayta urinib ko\'ring' : 'Hozircha xalqaro aloqalar mavjud emas. Birinchi aloqani qo\'shing!'}
								</p>
								{!searchTerm && (
									<button
										className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center space-x-2"
										onClick={openCreateModal}
									>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
										</svg>
										<span>Birinchi Aloqani Qo'shish</span>
									</button>
								)}
							</div>
						</div>
					)}
				</div>

				{/* Results Count */}
				{filteredRelations.length > 0 && (
					<div className="mt-4 text-sm text-gray-600">
						Topildi: {filteredRelations.length} ta xalqaro aloqa
						{searchTerm && ` ("${searchTerm}" bo'yicha)`}
					</div>
				)}
			</div>

			{/* Create/Edit Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
					<div
						className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Modal Header */}
						<div className="flex justify-between items-center p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-3xl">
							<div>
								<h2 className="text-2xl font-bold text-gray-800">
									{editingId ? 'Xalqaro Aloqani Tahrirlash' : 'Yangi Xalqaro Aloqa Qo\'shish'}
								</h2>
								<p className="text-gray-600 mt-1">
									{editingId ? 'Xalqaro aloqa ma\'lumotlarini yangilang' : 'Yangi xalqaro aloqa ma\'lumotlarini kiriting'}
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
							<div className="space-y-8">
								{/* Uzbek Section */}
								<div className="bg-gradient-to-r from-blue-50 to-cyan-100 p-6 rounded-2xl">
									<h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
										<span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
										O'zbekcha Ma'lumotlar
									</h3>

									<div className="space-y-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Sarlavha (O'zbekcha)
											</label>
											<input
												type="text"
												name="title_uz"
												value={formData.title_uz}
												onChange={handleInputChange}
												required
												placeholder="Xalqaro aloqa sarlavhasini kiriting"
												className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Tavsif (O'zbekcha)
											</label>
											<textarea
												name="description_uz"
												value={formData.description_uz}
												onChange={handleInputChange}
												required
												rows="4"
												placeholder="Xalqaro aloqa tavsifini kiriting"
												className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white resize-none"
											/>
										</div>
									</div>
								</div>

								{/* Russian Section */}
								<div className="bg-gradient-to-r from-purple-50 to-pink-100 p-6 rounded-2xl">
									<h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
										<span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
										Ruscha Ma'lumotlar
									</h3>

									<div className="space-y-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Sarlavha (Ruscha)
											</label>
											<input
												type="text"
												name="title_ru"
												value={formData.title_ru}
												onChange={handleInputChange}
												required
												placeholder="Введите заголовок международного отношения"
												className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Tavsif (Ruscha)
											</label>
											<textarea
												name="description_ru"
												value={formData.description_ru}
												onChange={handleInputChange}
												required
												rows="4"
												placeholder="Введите описание международного отношения"
												className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white resize-none"
											/>
										</div>
									</div>
								</div>

								{/* English Section */}
								<div className="bg-gradient-to-r from-green-50 to-emerald-100 p-6 rounded-2xl">
									<h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
										<span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
										Inglizcha Ma'lumotlar
									</h3>

									<div className="space-y-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Sarlavha (Inglizcha)
											</label>
											<input
												type="text"
												name="title_en"
												value={formData.title_en}
												onChange={handleInputChange}
												required
												placeholder="Enter international relation title"
												className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Tavsif (Inglizcha)
											</label>
											<textarea
												name="description_en"
												value={formData.description_en}
												onChange={handleInputChange}
												required
												rows="4"
												placeholder="Enter international relation description"
												className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white resize-none"
											/>
										</div>
									</div>
								</div>

								{/* Photos Section */}
								<div className="bg-gradient-to-r from-orange-50 to-red-100 p-6 rounded-2xl">
									<h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
										<span className="w-2 h-2 bg-orange-600 rounded-full mr-3"></span>
										Rasmlar
									</h3>

									{/* Existing Photos (for edit mode) */}
									{editingId && formData.existingPhotos && formData.existingPhotos.length > 0 && (
										<div className="mb-6">
											<label className="block text-sm font-medium text-gray-700 mb-3">
												Mavjud Rasmlar
											</label>
											<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
												{formData.existingPhotos.map((photo, index) => (
													<div key={index} className="relative group">
														<img
															src={`${baseURL}${photo}`}
															alt={`Mavjud rasm ${index + 1}`}
															className="w-full h-24 object-cover rounded-lg"
														/>
														<button
															type="button"
															onClick={() => removeExistingPhoto(photo)}
															className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
														>
															×
														</button>
													</div>
												))}
											</div>
										</div>
									)}

									{/* New Photos */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-3">
											Yangi Rasmlar Qo'shish
										</label>
										<input
											type="file"
											multiple
											accept="image/*"
											onChange={handleFileChange}
											className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white"
										/>
										<p className="text-sm text-gray-500 mt-2">
											Bir nechta rasm tanlash uchun Ctrl yoki Shift tugmasini bosib tanlang
										</p>

										{/* New Photos Preview */}
										{formData.photos.length > 0 && (
											<div className="mt-4">
												<label className="block text-sm font-medium text-gray-700 mb-3">
													Yangi Rasmlar Ko'rinishi
												</label>
												<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
													{formData.photos.map((photo, index) => (
														<div key={index} className="relative group">
															<img
																src={getPhotoPreview(photo)}
																alt={`Yangi rasm ${index + 1}`}
																className="w-full h-24 object-cover rounded-lg"
															/>
															<button
																type="button"
																onClick={() => removeNewPhoto(index)}
																className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
															>
																×
															</button>
														</div>
													))}
												</div>
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Modal Actions */}
							<div className="flex justify-end space-x-4 pt-8 border-t border-gray-200 mt-8">
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
		</div>
	)
}

export default AdminInternationalService