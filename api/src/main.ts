import express from 'express'
import mongoose from 'mongoose'

import apiRouter from './api/main'

import { logger } from './middleware/logger'
import { globalErrorHandler } from './middleware/errors-handlers'

import { Log } from './utils/logger'
import { ObjectId } from './types/db' // TODO: debug import

import db from './db' // TODO: debug import

const PORT = process.env.PORT || 8080
const MONGO_URI = process.env.MONGO_URI || undefined

const app = express()

app.use(express.json())
app.use(logger)

app.use('/api', apiRouter)
app.use('/test', (req, res) => { throw TypeError() })
app.use('/test1', (req, res) => { res.json({ status: 'git' }) })
app.use('/test2', (req, res) => {
  db.notes.deleteMany([{ _id: ('id.notes.c' as unknown) as ObjectId }])
  res.json({ data: db.notes.getMany() })
})

app.use(globalErrorHandler)

app.listen(PORT, () => {
  Log.info('Server is running on port', PORT)

  if (MONGO_URI === undefined)
    Log.warn('MONG_URI has not been defined - connection to database will not be established!')
  else 
    mongoose
      .connect(MONGO_URI, {})
      .then(() => { 
        Log.info('Connected to db') 
      })
      .catch(error => { 
        Log.error('Error connecting to db:', error.message) 
      })
})
