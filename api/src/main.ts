import express from 'express'
import mongoose from 'mongoose'

import apiRouter from './api/main'

const PORT = process.env.PORT || 8080
const MONGO_URI = process.env.MONGO_URI || undefined

const app = express()

app.use(express.json())
app.use((req, res, next) => {
  console.log(`[${new Date()}] ${req.method} ${req.url}`)
  next()
})

app.use('/api', apiRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)

  if (MONGO_URI === undefined)
    console.warn('MONG_URI has not been defined - connection to database will not be established!')
  else 
    mongoose
      .connect(MONGO_URI, {})
      .then(() => { console.log('Connected to db') })
      .catch(error => { console.error('Error connecting to db:', error.message) })
})
