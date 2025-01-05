import express from 'express'
import cors from 'cors'

import apiRouter from './api/router'
import healthcheck from './api/healthcheck'

import { logger } from './middleware/logger'
import { globalErrorHandler } from './middleware/errors-handlers'

import grpc from './proto/grpc'

import Log from '@shared/logger'

import { isProd } from '@shared/env'


const PORT = process.env.PORT || 8080
const NODE_ENV = process.env.NOVE_ENV
const GRPC_ADDRESS = process.env.GRPC_ADDRESS


Log.init(() => isProd(NODE_ENV))

if (GRPC_ADDRESS === undefined)
  Log.warn('GRPC_ADDRESS has not been defined - data fetch requests will result in connection errors')
else {
  grpc.Client.init(GRPC_ADDRESS, grpc.getInsecureCredentials())
  Log.info(`gRPC connection established at ${GRPC_ADDRESS}`)
}


const app = express()
const corsOptions = {
  origins: ['http://localhost:8044'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Accept', 'User-Agent'],
  optionsSuccessStatus: 204,
}


app.use(cors<cors.CorsRequest>(corsOptions))
app.use(express.json())
app.use(logger)

app.use('/api', healthcheck, apiRouter)

app.use(globalErrorHandler)

app.listen(PORT, () => {
  Log.info(`Service Express REST API is running on localhost:${PORT}`)
})
