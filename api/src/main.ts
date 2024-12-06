import express from 'express'
import mongoose from 'mongoose'

import apiRouter from './api/main'

import { logger } from './middleware/logger'
import { globalErrorHandler } from './middleware/errors-handlers'
import { addGeneralDataToResponse } from './middleware/intercepters'

import { log } from './utils/logger'

import db from './db/crud' // TODO: debug import
import { ObjectId } from 'types/db'

const PORT = process.env.PORT || 8080
const MONGO_URI = process.env.MONGO_URI || undefined

const app = express()

app.use(express.json())
app.use(logger)
// app.use(addGeneralDataToResponse)

app.use('/api', apiRouter)
app.use('/test', (req, res) => { throw TypeError() })
app.use('/test1', (req, res) => { res.json({ status: 'git' }) })
app.use('/test2', (req, res) => {
  db.deleteNotes([{ _id: ('id.notes.c' as unknown) as ObjectId }])
  res.json({ data: db.getNotes() })
})

app.use(globalErrorHandler)

app.listen(PORT, () => {
  log('info', 'Server is running on port', PORT)

  if (MONGO_URI === undefined)
    log('warn', 'MONG_URI has not been defined - connection to database will not be established!')
  else 
    mongoose
      .connect(MONGO_URI, {})
      .then(() => { 
        log('info', 'Connected to db') 
      })
      .catch(error => { 
        log('error', 'Error connecting to db:', error.message) 
      })
})
