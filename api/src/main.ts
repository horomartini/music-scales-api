import express from 'express'
import mongoose from 'mongoose'

import apiRouter from './api'

const PORT = process.env.PORT || 8080
const MONGO_URI = process.env.MONGO_URI || ''

const app = express()
app.use(express.json())

app.use('/api', apiRouter)

app.listen(PORT, () => {
  mongoose
    .connect(MONGO_URI, {})
    .then(() => { console.log('Connected to db') })
    .catch(error => { console.error('Error connecting to db:', error.message) })

  console.log(`Server is running on port ${PORT}`)
})