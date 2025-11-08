const express = require('express')
const router = express.Router()
const { create, getAll, update, deleted } = require('../controllers/structure.controller')
const multiUpload = require("../middlewares/multiUpload.middleware")
router.post("/create", multiUpload, create)
router.get("/getAll", getAll)
router.put('/update/:id', multiUpload, update)
router.delete('/delete/:id', deleted)


module.exports = router