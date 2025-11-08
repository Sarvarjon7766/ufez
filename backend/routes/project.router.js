const express = require('express')
const router = express.Router()
const { create, getAll, update, deleted, getAlll } = require('../controllers/project.controller')

router.post('/create', create)
router.get('/getAll/:lang/:prossesing', getAll)
router.put('/update/:id', update)
router.delete('/delete/:id', deleted)
router.get('/getAll/:prossesing', getAlll)






module.exports = router