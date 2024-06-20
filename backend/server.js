const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')

const app = express()

mongoose.connect('mongodb://localhost:27017/skyexplorer')
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error)
  })

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
