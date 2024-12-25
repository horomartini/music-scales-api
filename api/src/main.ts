import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import http from 'http'

import apiRouter from './api/main'

import { logger } from './middleware/logger'
import { globalErrorHandler } from './middleware/errors-handlers'

import { Log } from './utils/logger'
import { ObjectId } from './types/db' // TODO: debug import

import db from './db' // TODO: debug import
import graphql from './graphql'

const PORT = process.env.PORT || 8080
const MONGO_URI = process.env.MONGO_URI || undefined
const NO_APOLLO = process.env.NO_APOLLO || false

const app = express()
const httpServer = http.createServer(app)
const corsOptions = {
  origins: ['http://localhost:8044', 'http://localhost:27017'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Accept', 'User-Agent'],
}

app.use(cors<cors.CorsRequest>(corsOptions))
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

if (!NO_APOLLO)
  startApollo()

startServer()


async function startServer() {
  await new Promise<void>((resolve) => {
    httpServer.listen({ port: PORT }, resolve)
  })
  
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
}

async function startApollo() {
  Log.info('Starting Apollo Graphql server alongside Express')

  const { ApolloServer } = require('@apollo/server')
  const { expressMiddleware } = require('@apollo/server/express4')
  const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')

  const apollo = new ApolloServer({ 
    typeDefs: graphql.typeDefs, 
    resolvers: graphql.resolvers, 
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })] 
  })
  
  await apollo.start()
  
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(corsOptions),
    express.json(),
    expressMiddleware(apollo),
  )
}
