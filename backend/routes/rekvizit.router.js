const express = require('express')
const router = express.Router()
const { create, getAll, update, deleted, getAlll } = require('../controllers/rekvizit.controller')

router.post('/create', create)
router.get('/getAll/:lang', getAll)
router.get('/getAll', getAlll)
router.put('/update/:id', update)
router.delete('/delete/:id', deleted)

module.exports = router