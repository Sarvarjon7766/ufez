import axios from 'axios'
import { useEffect, useState } from 'react'

const AdminCharter = () => {
	const [charters, setCharters] = useState([])
	const [filteredCharters, setFilteredCharters] = useState([])
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
		signatory_uz: '',
		signatory_ru: '',
		signatory_en: '',
		file: null,
		active: false
	})

	const [editingId, setEditingId] = useState(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [activeTab, setActiveTab] = useState('uz')

	const baseURL = import.meta.env.VITE_BASE_URL

	// Fetch all charters
	const fetchCharters = async () => {
		setLoading(true)
		try {
			const response = await axios.get(`${baseURL}/api/charter/getAll`)
			setCharters(response.data?.charters || [])
			setFilteredCharters(response.data?.charters || [])
			setError('')
		} catch (err) {
			console.error('Error fetching charters:', err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchCharters()
	}, [])

	// Search functionality
	useEffect(() => {
		if (searchTerm.trim() === '') {
			setFilteredCharters(charters)
		} else {
			const filtered = charters.filter(charter =>
				charter.title_uz.toLowerCase().includes(searchTerm.toLowerCase()) ||
				charter.title_ru.toLowerCase().includes(searchTerm.toLowerCase()) ||
				charter.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
				charter.description_uz.toLowerCase().includes(searchTerm.toLowerCase()) ||
				charter.description_ru.toLowerCase().includes(searchTerm.toLowerCase()) ||
				charter.description_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
				charter.signatory_uz.toLowerCase().includes(searchTerm.toLowerCase()) ||
				charter.signatory_ru.toLowerCase().includes(searchTerm.toLowerCase()) ||
				charter.signatory_en.toLowerCase().includes(searchTerm.toLowerCase())
			)
			setFilteredCharters(filtered)
		}
	}, [searchTerm, charters])

	// Handle form input changes
	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target
		setFormData({
			...formData,
			[name]: type === 'checkbox' ? checked : value
		})
	}

	// Handle file input change
	const handleFileChange = (e) => {
		setFormData({
			...formData,
			file: e.target.files[0]
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
			signatory_uz: '',
			signatory_ru: '',
			signatory_en: '',
			file: null,
			active: false
		})
		setEditingId(null)
		setActiveTab('uz')
	}

	// Create new charter
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
			formDataToSend.append('signatory_uz', formData.signatory_uz)
			formDataToSend.append('signatory_ru', formData.signatory_ru)
			formDataToSend.append('signatory_en', formData.signatory_en)
			formDataToSend.append('active', formData.active)

			// Add file
			if (formData.file) {
				formDataToSend.append('file', formData.file)
			}

			await axios.post(`${baseURL}/api/charter/create`, formDataToSend, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})

			setSuccess('Nizom muvaffaqiyatli qo\'shildi')
			resetForm()
			setIsModalOpen(false)
			fetchCharters()
		} catch (err) {
			setError('Nizom qo\'shishda xatolik yuz berdi')
			console.error('Error creating charter:', err)
		} finally {
			setLoading(false)
		}
	}

	// Update charter
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
			formDataToSend.append('signatory_uz', formData.signatory_uz)
			formDataToSend.append('signatory_ru', formData.signatory_ru)
			formDataToSend.append('signatory_en', formData.signatory_en)
			formDataToSend.append('active', formData.active)

			// Add new file if selected
			if (formData.file) {
				formDataToSend.append('file', formData.file)
			}

			// Add old file URL for deletion if new file is selected
			if (formData.file && formData.existingFile) {
				formDataToSend.append('oldFile', formData.existingFile)
			}

			await axios.put(`${baseURL}/api/charter/update/${editingId}`, formDataToSend, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})

			setSuccess('Nizom muvaffaqiyatli yangilandi')
			resetForm()
			setIsModalOpen(false)
			fetchCharters()
		} catch (err) {
			setError('Nizomni yangilashda xatolik yuz berdi')
			console.error('Error updating charter:', err)
		} finally {
			setLoading(false)
		}
	}

	// Delete charter
	const handleDelete = async (id) => {
		if (!window.confirm('Haqiqatan ham ushbu nizomni o\'chirmoqchimisiz?')) {
			return
		}

		setLoading(true)
		try {
			// Get charter data to send file URL for deletion
			const charterToDelete = charters.find(charter => charter._id === id)
			if (charterToDelete && charterToDelete.file) {
				await axios.delete(`${baseURL}/api/charter/delete/${id}`, {
					data: { fileUrl: charterToDelete.file }
				})
			} else {
				await axios.delete(`${baseURL}/api/charter/delete/${id}`)
			}

			setSuccess('Nizom muvaffaqiyatli o\'chirildi')
			fetchCharters()
		} catch (err) {
			setError('Nizomni o\'chirishda xatolik yuz berdi')
			console.error('Error deleting charter:', err)
		} finally {
			setLoading(false)
		}
	}

	// Edit charter - populate form with existing data
	const handleEdit = (charter) => {
		setFormData({
			title_uz: charter.title_uz,
			title_ru: charter.title_ru,
			title_en: charter.title_en,
			description_uz: charter.description_uz,
			description_ru: charter.description_ru,
			description_en: charter.description_en,
			signatory_uz: charter.signatory_uz,
			signatory_ru: charter.signatory_ru,
			signatory_en: charter.signatory_en,
			file: null,
			existingFile: charter.file,
			active: charter.active
		})
		setEditingId(charter._id)
		setIsModalOpen(true)
	}

	// Toggle active status
	const toggleActive = async (id, currentStatus) => {
		setLoading(true)
		try {
			const charter = charters.find(c => c._id === id)
			const formDataToSend = new FormData()

			// Add all fields
			formDataToSend.append('title_uz', charter.title_uz)
			formDataToSend.append('title_ru', charter.title_ru)
			formDataToSend.append('title_en', charter.title_en)
			formDataToSend.append('description_uz', charter.description_uz)
			formDataToSend.append('description_ru', charter.description_ru)
			formDataToSend.append('description_en', charter.description_en)
			formDataToSend.append('signatory_uz', charter.signatory_uz)
			formDataToSend.append('signatory_ru', charter.signatory_ru)
			formDataToSend.append('signatory_en', charter.signatory_en)
			formDataToSend.append('active', !currentStatus)

			await axios.put(`${baseURL}/api/charter/update/${id}`, formDataToSend, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})

			setSuccess(`Nizom ${!currentStatus ? 'faollashtirildi' : 'o\'chirildi'}`)
			fetchCharters()
		} catch (err) {
			setError('Statusni o\'zgartirishda xatolik yuz berdi')
			console.error('Error toggling active status:', err)
		} finally {
			setLoading(false)
		}
	}

	// Open modal for creating new charter
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

	// Format date
	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString('uz-UZ', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	}

	// Truncate text for table view
	const truncateText = (text, length = 50) => {
		if (!text) return ''
		if (text.length <= length) return text
		return text.substring(0, length) + '...'
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
			<div className="mx-auto">
				{/* Header */}
				<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
					<div className="mb-6 lg:mb-0">
						<h1 className="text-3xl font-bold text-gray-800 mb-2">
							Nizomlar Boshqaruvi
						</h1>
					</div>
					<button
						className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center space-x-2"
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
							placeholder="Nizomlarni qidirish..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="block w-full text-black pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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
							<div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
							<span className="text-gray-600 font-medium">Ma'lumotlar yuklanmoqda...</span>
						</div>
					</div>
				)}

				{/* Charters Table (Desktop) */}
				<div className="hidden lg:block bg-white rounded-2xl shadow-lg overflow-hidden">
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gradient-to-r from-gray-50 to-purple-50">
								<tr>
									<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[200px]">
										Sarlavha (UZ)
									</th>
									<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[120px]">
										Imzo qo'yuvchi
									</th>
									<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[100px]">
										Fayl
									</th>
									<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[80px]">
										Holati
									</th>
									<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap min-w-[140px]">
										Amallar
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredCharters.length > 0 ? (
									filteredCharters.map(charter => (
										<tr key={charter._id} className="hover:bg-purple-50 transition-colors duration-200">
											{/* Title UZ */}
											<td className="px-4 py-3">
												<div className="text-sm font-medium text-gray-900 break-words min-w-[200px] max-w-[300px]">
													{charter.title_uz}
												</div>
												<div className="text-xs text-gray-500 mt-1">
													{formatDate(charter.createdAt)}
												</div>
											</td>

											{/* Signatory */}
											<td className="px-4 py-3">
												<div className="text-sm text-gray-900 break-words min-w-[120px] max-w-[150px]">
													{charter.signatory_uz}
												</div>
											</td>

											{/* File */}
											<td className="px-4 py-3">
												{charter.file ? (
													<a
														href={`${baseURL}${charter.file}`}
														target="_blank"
														rel="noopener noreferrer"
														className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
													>
														<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
														</svg>
														<span>PDF ko'rish</span>
													</a>
												) : (
													<span className="text-sm text-gray-500">Fayl yo'q</span>
												)}
											</td>

											{/* Status */}
											<td className="px-4 py-3">
												<button
													onClick={() => toggleActive(charter._id, charter.active)}
													disabled={loading}
													className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${charter.active
														? 'bg-green-100 text-green-800 hover:bg-green-200'
														: 'bg-red-100 text-red-800 hover:bg-red-200'
														} disabled:opacity-50 disabled:cursor-not-allowed`}
												>
													{charter.active ? 'Faol' : 'Nofaol'}
												</button>
											</td>

											{/* Actions */}
											<td className="px-4 py-3 whitespace-nowrap">
												<div className="flex space-x-2 min-w-[140px]">
													<button
														className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow flex items-center space-x-2 flex-1 justify-center"
														onClick={() => handleEdit(charter)}
														disabled={loading}
													>
														<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
														</svg>
														<span className="text-xs">Tahrir</span>
													</button>
													<button
														className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow flex items-center space-x-2 flex-1 justify-center"
														onClick={() => handleDelete(charter._id)}
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
										<td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
											{searchTerm ? 'Qidiruv bo\'yicha hech narsa topilmadi' : 'Hech qanday nizom topilmadi'}
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* Charters Cards (Mobile) */}
				<div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
					{filteredCharters.length > 0 ? (
						filteredCharters.map(charter => (
							<div key={charter._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
								<div className="p-6">
									<div className="flex items-start justify-between mb-4">
										<div className="flex-1">
											<h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
												{charter.title_uz}
											</h3>
											<div className="flex items-center space-x-2 text-sm text-gray-500">
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
												</svg>
												<span>{formatDate(charter.createdAt)}</span>
											</div>
										</div>
										<div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
											{charter.title_uz?.charAt(0) || 'N'}
										</div>
									</div>

									<div className="mb-4">
										<div className="flex items-center justify-between mb-2">
											<span className="text-sm font-medium text-gray-700">Imzo qo'yuvchi:</span>
											<span className="text-sm text-gray-600">{charter.signatory_uz}</span>
										</div>
										<div className="flex items-center justify-between mb-2">
											<span className="text-sm font-medium text-gray-700">Holati:</span>
											<button
												onClick={() => toggleActive(charter._id, charter.active)}
												disabled={loading}
												className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${charter.active
													? 'bg-green-100 text-green-800 hover:bg-green-200'
													: 'bg-red-100 text-red-800 hover:bg-red-200'
													} disabled:opacity-50 disabled:cursor-not-allowed`}
											>
												{charter.active ? 'Faol' : 'Nofaol'}
											</button>
										</div>
									</div>

									{charter.file && (
										<div className="mb-4">
											<a
												href={`${baseURL}${charter.file}`}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors duration-200"
											>
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
												</svg>
												<span className="text-sm">PDF faylni ko'rish</span>
											</a>
										</div>
									)}

									{/* Language Tabs */}
									<div className="mb-4">
										<div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
											{['uz', 'ru', 'en'].map(lang => (
												<button
													key={lang}
													className={`flex-1 py-1 px-2 text-xs font-medium rounded-md transition-colors ${activeTab === lang
														? 'bg-white text-purple-600 shadow-sm'
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
												<strong className="text-gray-800">{charter.title_uz}</strong>
												<p className="text-gray-600 mt-1 line-clamp-3">{charter.description_uz}</p>
											</div>
											<div className={activeTab === 'ru' ? 'block' : 'hidden'}>
												<strong className="text-gray-800">{charter.title_ru}</strong>
												<p className="text-gray-600 mt-1 line-clamp-3">{charter.description_ru}</p>
											</div>
											<div className={activeTab === 'en' ? 'block' : 'hidden'}>
												<strong className="text-gray-800">{charter.title_en}</strong>
												<p className="text-gray-600 mt-1 line-clamp-3">{charter.description_en}</p>
											</div>
										</div>
									</div>

									{/* Actions */}
									<div className="flex space-x-2 pt-4 border-t border-gray-200">
										<button
											className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center space-x-2"
											onClick={() => handleEdit(charter)}
											disabled={loading}
										>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
											</svg>
											<span>Tahrirlash</span>
										</button>
										<button
											className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center space-x-2"
											onClick={() => handleDelete(charter._id)}
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
								<div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
									<svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
								</div>
								<h3 className="text-xl font-semibold text-gray-700 mb-2">
									{searchTerm ? 'Qidiruv bo\'yicha hech narsa topilmadi' : 'Hech qanday nizom topilmadi'}
								</h3>
								<p className="text-gray-500 mb-6">
									{searchTerm ? 'Boshqa so\'zlar bilan qayta urinib ko\'ring' : 'Hozircha nizomlar mavjud emas. Birinchi nizomni qo\'shing!'}
								</p>
								{!searchTerm && (
									<button
										className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center space-x-2"
										onClick={openCreateModal}
									>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
										</svg>
										<span>Birinchi Nizomni Qo'shish</span>
									</button>
								)}
							</div>
						</div>
					)}
				</div>

				{/* Results Count */}
				{filteredCharters.length > 0 && (
					<div className="mt-4 text-sm text-gray-600">
						Topildi: {filteredCharters.length} ta nizom
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
						<div className="flex justify-between items-center p-8 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-3xl">
							<div>
								<h2 className="text-2xl font-bold text-gray-800">
									{editingId ? 'Nizomni Tahrirlash' : 'Yangi Nizom Qo\'shish'}
								</h2>
								<p className="text-gray-600 mt-1">
									{editingId ? 'Nizom ma\'lumotlarini yangilang' : 'Yangi nizom ma\'lumotlarini kiriting'}
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
								<div className="bg-gradient-to-r from-purple-50 to-indigo-100 p-6 rounded-2xl">
									<h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
										<span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
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
												placeholder="Nizom sarlavhasini kiriting"
												className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white"
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
												placeholder="Nizom tavsifini kiriting"
												className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white resize-none"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Imzo qo'yuvchi (O'zbekcha)
											</label>
											<input
												type="text"
												name="signatory_uz"
												value={formData.signatory_uz}
												onChange={handleInputChange}
												required
												placeholder="Imzo qo'yuvchi ismini kiriting"
												className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white"
											/>
										</div>
									</div>
								</div>

								{/* Russian Section */}
								<div className="bg-gradient-to-r from-blue-50 to-cyan-100 p-6 rounded-2xl">
									<h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
										<span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
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
												placeholder="Введите заголовок устава"
												className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
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
												placeholder="Введите описание устава"
												className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white resize-none"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Imzo qo'yuvchi (Ruscha)
											</label>
											<input
												type="text"
												name="signatory_ru"
												value={formData.signatory_ru}
												onChange={handleInputChange}
												required
												placeholder="Введите имя подписанта"
												className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
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
												placeholder="Enter charter title"
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
												placeholder="Enter charter description"
												className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white resize-none"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Imzo qo'yuvchi (Inglizcha)
											</label>
											<input
												type="text"
												name="signatory_en"
												value={formData.signatory_en}
												onChange={handleInputChange}
												required
												placeholder="Enter signatory name"
												className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
											/>
										</div>
									</div>
								</div>

								{/* File and Status Section */}
								<div className="bg-gradient-to-r from-orange-50 to-red-100 p-6 rounded-2xl">
									<h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
										<span className="w-2 h-2 bg-orange-600 rounded-full mr-3"></span>
										Fayl va Sozlamalar
									</h3>

									<div className="space-y-4">
										{/* File Upload */}
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												PDF Fayl
											</label>
											<input
												type="file"
												accept=".pdf"
												onChange={handleFileChange}
												className="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white"
											/>
											{editingId && formData.existingFile && (
												<div className="mt-2">
													<p className="text-sm text-gray-600 mb-1">Mavjud fayl:</p>
													<a
														href={`${baseURL}${formData.existingFile}`}
														target="_blank"
														rel="noopener noreferrer"
														className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
													>
														<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
														</svg>
														<span>Joriy PDF faylni ko'rish</span>
													</a>
												</div>
											)}
										</div>

										{/* Active Status */}
										<div className="flex items-center">
											<input
												type="checkbox"
												name="active"
												checked={formData.active}
												onChange={handleInputChange}
												className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
											/>
											<label className="ml-2 text-sm font-medium text-gray-700">
												Nizom faol
											</label>
										</div>
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
									className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center space-x-2"
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

export default AdminCharter