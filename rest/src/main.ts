import type { Request, Response } from 'express'

import express from 'express'
import cors from 'cors'
import swaggerJSDoc from 'swagger-jsdoc'

import apiRouter from './api/router'
import healthcheck from './api/healthcheck'
import * as swaggerComponents from './api/v1/swagger'

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
  origins: ['http://nginx:8044'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Accept', 'User-Agent'],
  optionsSuccessStatus: 204,
}

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Music Scales API Documentation',
      version: '1.0.0',
      description: 'Generated API documentation using OpenAPI',
    },
    components: swaggerComponents,
  },
  apis: ['./src/api/v1/**/*.ts'],
}

const openAPISpec = swaggerJSDoc(swaggerOptions)


app.use(cors<cors.CorsRequest>(corsOptions))
app.use(express.json())
app.use(logger)

app.use('/api', healthcheck, apiRouter)
app.get('/api/openapi.json', (_: Request, res: Response) => {
  res.json(openAPISpec)
})

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl}`,
  })
})
app.use(globalErrorHandler)

app.listen(PORT, () => {
  Log.info(`Service Express REST API is running on localhost:${PORT}`)
})
