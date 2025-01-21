import express from 'express'
import swaggerUi from 'swagger-ui-express'

import Log from '@shared/logger'

import { isProd } from '@shared/env'


const PORT = process.env.PORT || 8080
const NODE_ENV = process.env.NOVE_ENV
const OPENAPI_SPEC_PATH = process.env.OPENAPI_SPEC_PATH || 'http://localhost:8044/api/openapi.json'


Log.init(() => isProd(NODE_ENV))

const app = express()

app.use(
  '/api/swagger',
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: OPENAPI_SPEC_PATH,
    },
  })
)

app.listen(PORT, () => {
  Log.info(`Service SwaggerUI Playground is running on localhost:${PORT}`)
})
