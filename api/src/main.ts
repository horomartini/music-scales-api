import express from 'express'
import mongoose from 'mongoose'

import apiRouter from './api/main'

import { logger } from './middleware/logger'
import { globalErrorHandler } from './middleware/errors-handlers'

import { log } from './utils/logger'
import { addGeneralDataToResponse } from './middleware/intercepters'

const PORT = process.env.PORT || 8080
const MONGO_URI = process.env.MONGO_URI || undefined

const app = express()

app.use(express.json())
app.use(logger)
// app.use(addGeneralDataToResponse)

app.use('/api', apiRouter)
app.use('/test', (req, res) => { throw TypeError() })

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
