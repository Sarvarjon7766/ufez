const express = require('express')
const { create, getAll, getAlll, update, deleted } = require('../controllers/task.controller')
const router = express.Router()

router.post('/create', create)
router.get('/getAll/:lang', getAll)
router.get('/getAll', getAlll)
router.put('/update/:id', update)
router.delete('/delete/:id', deleted)

module.exports = router