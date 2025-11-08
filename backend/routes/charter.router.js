const express = require('express')
const router = express.Router()
const fileUpload = require('../middlewares/fileUpload.middleware')
const { create, getAll, getAlll, update, deleted } = require('../controllers/charter.controller')

// Fayl yuklash
router.post('/create', fileUpload.single('file'), create)
router.get('/getAll/:lang', getAll)
router.get('/getAll', getAlll)
router.put('/update/:id', fileUpload.single('file'), update)
router.delete('/delete/:id', deleted)

module.exports = router
