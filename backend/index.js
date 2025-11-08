const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const multer = require('multer')
const fs = require('fs')
dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000
const connectMainDB = require('./config/db')
connectMainDB()
app.use(cors())
app.use(express.json())
const { leaderrouter, servicerouter, relationrouter, charterrouter, bannerrouter, taskrouter, egovernmentrouter, structurerouter, rekvizitrouter, employerrouter, landarearouter, newsrouter, askedrouter, applicationrouter, projectrouter, userrouter } = require('./routes/index')

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))



app.use('/api/leader', leaderrouter)
app.use('/api/service', servicerouter)
app.use('/api/relation', relationrouter)
app.use('/api/charter', charterrouter)
app.use('/api/banner', bannerrouter)
app.use('/api/task', taskrouter)
app.use('/api/egovernment', egovernmentrouter)
app.use('/api/structure', structurerouter)
app.use('/api/rekvizit', rekvizitrouter)
app.use('/api/employer', employerrouter)
app.use('/api/landarea', landarearouter)
app.use('/api/news', newsrouter)
app.use('/api/asked', askedrouter)
app.use('/api/application', applicationrouter)
app.use('/api/project', projectrouter)
app.use('/api/user', userrouter)


app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: 'Fayl yuklashda xatolik: ' + err.message
    })
  }
  console.error(err.stack)
  res.status(500).send('Serverda xatolik yuz berdi!')
})
const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
  console.log('Uploads papkasi yaratildi')
}
app.listen(PORT, () => {
  console.log(`🚀 Server http://localhost:${PORT} da ishga tushdi`)
})
