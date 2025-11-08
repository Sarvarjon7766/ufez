const express = require('express')
const router = express.Router()
const uploadPhotos = require('../middlewares/uploadPhotos')
const relationController = require('../controllers/international.relations.controller')

router.post('/create', uploadPhotos, relationController.create)
router.get('/getAll/:lang', relationController.getAll)
router.get('/getAll', relationController.getAlll)
router.put('/update/:id', uploadPhotos, relationController.update)
router.delete('/delete/:id', relationController.deleted)

module.exports = router
