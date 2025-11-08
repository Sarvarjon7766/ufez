import axios from 'axios'
import { useEffect, useState } from 'react'

const AdminOrganizationStructure = () => {
	const [structures, setStructures] = useState([])
	const [filteredStructures, setFilteredStructures] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
	const [searchTerm, setSearchTerm] = useState('')

	// Form state for create/update
	const [formData, setFormData] = useState({
		photo: null,
		file: null
	})
	const [previewPhoto, setPreviewPhoto] = useState('')
	const [previewFileName, setPreviewFileName] = useState('')

	const [editingId, setEditingId] = useState(null)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const baseURL = import.meta.env.VITE_BASE_URL

	// Fetch all structures
	const fetchStructures = async () => {
		setLoading(true)
		try {
			const response = await axios.get(`${baseURL}/api/structure/getAll`)
			setStructures(response.data?.structures || [])
			setFilteredStructures(response.data?.structures || [])
			setError('')
		} catch (err) {
			console.error('Error fetching structures:', err)
			setError('Tuzilmalarni yuklashda xatolik yuz berdi')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchStructures()
	}, [])

	// Search functionality
	useEffect(() => {
		if (searchTerm.trim() === '') {
			setFilteredStructures(structures)
		} else {
			const filtered = structures.filter(structure =>
				structure.photo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				structure.file?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				structure._id?.toLowerCase().includes(searchTerm.toLowerCase())
			)
			setFilteredStructures(filtered)
		}
	}, [searchTerm, structures])

	// Handle file input changes
	const handleFileChange = (e) => {
		const { name, files } = e.target

		if (files && files[0]) {
			setFormData(prev => ({
				...prev,
				[name]: files[0]
			}))

			// Preview for photo
			if (name === 'photo') {
				const reader = new FileReader()
				reader.onload = (e) => {
					setPreviewPhoto(e.target.result)
				}
				reader.readAsDataURL(files[0])
			}

			// Show file name for document
			if (name === 'file') {
				setPreviewFileName(files[0].name)
			}
		}
	}

	// Reset form
	const resetForm = () => {
		setFormData({
			photo: null,
			file: null
		})
		setPreviewPhoto('')
		setPreviewFileName('')
		setEditingId(null)
	}

	// Create new structure
	const handleCreate = async (e) => {
		e.preventDefault()
		setLoading(true)

		try {
			const submitData = new FormData()

			if (formData.photo) {
				submitData.append('photo', formData.photo)
			}
			if (formData.file) {
				submitData.append('file', formData.file)
			}

			await axios.post(`${baseURL}/api/structure/create`, submitData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})

			setSuccess('Tuzilma muvaffaqiyatli qo\'shildi')
			resetForm()
			setIsModalOpen(false)
			fetchStructures()
		} catch (err) {
			setError('Tuzilma qo\'shishda xatolik yuz berdi')
			console.error('Error creating structure:', err)
		} finally {
			setLoading(false)
		}
	}

	// Update structure
	const handleUpdate = async (e) => {
		e.preventDefault()
		setLoading(true)

		try {
			const submitData = new FormData()

			// Only append files if they are selected
			if (formData.photo) {
				submitData.append('photo', formData.photo)
			}
			if (formData.file) {
				submitData.append('file', formData.file)
			}

			await axios.put(`${baseURL}/api/structure/update/${editingId}`, submitData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})

			setSuccess('Tuzilma muvaffaqiyatli yangilandi')
			resetForm()
			setIsModalOpen(false)
			fetchStructures()
		} catch (err) {
			setError('Tuzilmani yangilashda xatolik yuz berdi')
			console.error('Error updating structure:', err)
		} finally {
			setLoading(false)
		}
	}

	// Delete structure
	const handleDelete = async (id) => {
		if (!window.confirm('Haqiqatan ham ushbu tuzilmani o\'chirmoqchimisiz?')) {
			return
		}

		setLoading(true)
		try {
			await axios.delete(`${baseURL}/api/structure/delete/${id}`)
			setSuccess('Tuzilma muvaffaqiyatli o\'chirildi')
			fetchStructures()
		} catch (err) {
			setError('Tuzilmani o\'chirishda xatolik yuz berdi')
			console.error('Error deleting structure:', err)
		} finally {
			setLoading(false)
		}
	}

	// Edit structure - populate form with existing data
	const handleEdit = (structure) => {
		setFormData({
			photo: null,
			file: null
		})
		setPreviewPhoto(`${baseURL}${structure.photo}`)
		setPreviewFileName(structure.file ? structure.file.split('/').pop() : '')
		setEditingId(structure._id)
		setIsModalOpen(true)
	}

	// Open modal for creating new structure
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

	// Get file type icon
	const getFileIcon = (fileName) => {
		if (!fileName) return '📄'

		const ext = fileName.split('.').pop().toLowerCase()
		switch (ext) {
			case 'pdf':
				return '📕'
			case 'doc':
			case 'docx':
				return '📘'
			case 'xls':
			case 'xlsx':
				return '📗'
			case 'jpg':
			case 'jpeg':
			case 'png':
			case 'gif':
				return '🖼️'
			default:
				return '📄'
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
			<div className="mx-auto">
				{/* Header */}
				<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
					<div className="mb-6 lg:mb-0">
						<h1 className="text-3xl font-bold text-gray-800 mb-2">
							Tashkilot Tuzilmasi
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
							placeholder="Tuzilmalarni qidirish..."
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

				{/* Structures Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{filteredStructures.length > 0 ? (
						filteredStructures.map((structure, index) => (
							<div key={structure._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
								{/* Photo Preview */}
								<div className="h-48 bg-gray-100 relative">
									{structure.photo ? (
										<img
											src={`${baseURL}${structure.photo}`}
											alt="Tashkilot tuzilmasi"
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
											<svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
											</svg>
										</div>
									)}
									<div className="absolute top-3 left-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
										{index + 1}
									</div>
								</div>

								{/* Content */}
								<div className="p-6">
									{/* File Info */}
									{structure.file && (
										<div className="mb-4 p-3 bg-blue-50 rounded-lg">
											<div className="flex items-center space-x-2">
												<span className="text-2xl">{getFileIcon(structure.file)}</span>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-gray-700 truncate">
														{structure.file.split('/').pop()}
													</p>
													<p className="text-xs text-gray-500">PDF hujjat</p>
												</div>
											</div>
										</div>
									)}

									{/* Actions */}
									<div className="flex space-x-2">
										<button
											className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow flex items-center justify-center space-x-2"
											onClick={() => handleEdit(structure)}
											disabled={loading}
										>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
											</svg>
											<span className="text-sm">Tahrir</span>
										</button>
										<button
											className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow flex items-center justify-center space-x-2"
											onClick={() => handleDelete(structure._id)}
											disabled={loading}
										>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
											</svg>
											<span className="text-sm">O'chirish</span>
										</button>
									</div>

									{/* View Links */}
									<div className="mt-3 flex space-x-2">
										{structure.photo && (
											<a
												href={`${baseURL}${structure.photo}`}
												target="_blank"
												rel="noopener noreferrer"
												className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
											>
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
												</svg>
												<span>Rasm</span>
											</a>
										)}
										{structure.file && (
											<a
												href={`${baseURL}${structure.file}`}
												target="_blank"
												rel="noopener noreferrer"
												className="flex-1 text-center bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
											>
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
												</svg>
												<span>Hujjat</span>
											</a>
										)}
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
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
									</svg>
								</div>
								<h3 className="text-xl font-semibold text-gray-700 mb-2">
									{searchTerm ? 'Qidiruv bo\'yicha hech narsa topilmadi' : 'Hech qanday tuzilma topilmadi'}
								</h3>
								<p className="text-gray-500 mb-6">
									{searchTerm ? 'Boshqa so\'zlar bilan qayta urinib ko\'ring' : 'Hozircha tashkilot tuzilmasi mavjud emas. Birinchi tuzilmani qo\'shing!'}
								</p>
								{!searchTerm && (
									<button
										className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center space-x-2"
										onClick={openCreateModal}
									>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
										</svg>
										<span>Birinchi Tuzilmani Qo'shish</span>
									</button>
								)}
							</div>
						</div>
					)}
				</div>

				{/* Results Count */}
				{filteredStructures.length > 0 && (
					<div className="mt-4 text-sm text-gray-600">
						Topildi: {filteredStructures.length} ta tuzilma
						{searchTerm && ` ("${searchTerm}" bo'yicha)`}
					</div>
				)}
			</div>

			{/* Create/Edit Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
					<div
						className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Modal Header */}
						<div className="flex justify-between items-center p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-3xl">
							<div>
								<h2 className="text-2xl font-bold text-gray-800">
									{editingId ? 'Tuzilmani Tahrirlash' : 'Yangi Tuzilma Qo\'shish'}
								</h2>
								<p className="text-gray-600 mt-1">
									{editingId ? 'Tuzilma rasmi va hujjatlarini yangilang' : 'Yangi tuzilma rasmi va hujjatlarini yuklang'}
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
							<div className="space-y-6">
								{/* Photo Upload */}
								<div className="bg-gradient-to-r from-blue-50 to-cyan-100 p-6 rounded-2xl">
									<h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
										<span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
										Rasm Yuklash
									</h3>

									<div className="space-y-4">
										{/* Photo Preview */}
										{previewPhoto && (
											<div className="mb-4">
												<p className="text-sm font-medium text-gray-700 mb-2">Rasm ko'rinishi:</p>
												<div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
													<img
														src={previewPhoto}
														alt="Rasm ko'rinishi"
														className="w-full h-full object-contain"
													/>
												</div>
											</div>
										)}

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												{editingId ? 'Yangi rasm yuklash (ixtiyoriy)' : 'Rasm yuklash (majburiy)'}
											</label>
											<div className="flex items-center justify-center w-full">
												<label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-white hover:bg-gray-50 transition-colors duration-200">
													<div className="flex flex-col items-center justify-center pt-5 pb-6">
														<svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
														</svg>
														<p className="mb-2 text-sm text-gray-500">
															<span className="font-semibold">Rasmni yuklash uchun bosing</span>
														</p>
														<p className="text-xs text-gray-500">PNG, JPG, JPEG (Max: 5MB)</p>
													</div>
													<input
														type="file"
														name="photo"
														accept="image/*"
														onChange={handleFileChange}
														className="hidden"
													/>
												</label>
											</div>
										</div>
									</div>
								</div>

								{/* File Upload */}
								<div className="bg-gradient-to-r from-purple-50 to-pink-100 p-6 rounded-2xl">
									<h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
										<span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
										Hujjat Yuklash
									</h3>

									<div className="space-y-4">
										{/* File Preview */}
										{previewFileName && (
											<div className="mb-4 p-4 bg-white rounded-lg border border-purple-200">
												<div className="flex items-center space-x-3">
													<span className="text-2xl">{getFileIcon(previewFileName)}</span>
													<div className="flex-1">
														<p className="text-sm font-medium text-gray-700 truncate">
															{previewFileName}
														</p>
														<p className="text-xs text-gray-500">Yangi yuklangan fayl</p>
													</div>
												</div>
											</div>
										)}

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												{editingId ? 'Yangi hujjat yuklash (ixtiyoriy)' : 'Hujjat yuklash (ixtiyoriy)'}
											</label>
											<div className="flex items-center justify-center w-full">
												<label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-white hover:bg-gray-50 transition-colors duration-200">
													<div className="flex flex-col items-center justify-center pt-5 pb-6">
														<svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
														</svg>
														<p className="mb-2 text-sm text-gray-500">
															<span className="font-semibold">Hujjat yuklash uchun bosing</span>
														</p>
														<p className="text-xs text-gray-500">PDF, DOC, DOCX (Max: 10MB)</p>
													</div>
													<input
														type="file"
														name="file"
														accept=".pdf,.doc,.docx"
														onChange={handleFileChange}
														className="hidden"
													/>
												</label>
											</div>
										</div>
									</div>
								</div>

								{/* Important Note */}
								<div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
									<div className="flex items-start space-x-3">
										<svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
										</svg>
										<div>
											<p className="text-sm font-medium text-yellow-800">Eslatma</p>
											<p className="text-sm text-yellow-700 mt-1">
												{editingId
													? 'Agar yangi rasm yoki hujjat yuklamasangiz, mavjud fayllar saqlanib qoladi. Faqat yangi fayllarni yuklaganingizda ular yangilanadi.'
													: 'Rasm yuklash majburiy, hujjat yuklash ixtiyoriy. Kamida bitta rasm yuklashingiz kerak.'
												}
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* Modal Actions */}
							<div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
								<button
									type="button"
									onClick={closeModal}
									className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
									disabled={loading}
								>
									Bekor qilish
								</button>
								<button
									type="submit"
									disabled={loading || (!editingId && !formData.photo)}
									className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg flex items-center space-x-2"
								>
									{loading ? (
										<>
											<div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
											<span>
												{editingId ? 'Yangilanmoqda...' : 'Qo\'shilmoqda...'}
											</span>
										</>
									) : (
										<>
											<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
											</svg>
											<span>
												{editingId ? 'Yangilash' : 'Qo\'shish'}
											</span>
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

export default AdminOrganizationStructure