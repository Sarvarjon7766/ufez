const express = require('express')
const router = express.Router()
const { create, getAll } = require('../controllers/landarea.controller')
const upload = require("../middlewares/upload.middleware")

router.post("/create", upload.single("photo"), create)
router.get("/getAll/:lang", getAll)

module.exports = router