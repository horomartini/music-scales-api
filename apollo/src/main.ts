import type { ApolloContext } from './graphql/context'

import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { readFileSync } from 'fs'

import { createContext } from './graphql/context'
import { resolvers } from './graphql/resolvers'

import grpc from './proto/grpc'

import Log from '@shared/logger'

import { isProd } from '@shared/env'


const PORT = Number(process.env.PORT || 4000)
const NODE_ENV = process.env.NODE_ENV
const GRPC_ADDRESS = process.env.GRPC_ADDRESS


Log.init(() => isProd(NODE_ENV))

if (GRPC_ADDRESS === undefined)
  Log.warn('GRPC_ADDRESS has not been defined - data fetch requests will result in connection errors')
else {
  grpc.Client.init(GRPC_ADDRESS, grpc.getInsecureCredentials())
  Log.info(`gRPC connection established at ${GRPC_ADDRESS}`)
}


const typeDefs = readFileSync('./src/graphql/schema.graphql', { encoding: 'utf-8' })

const server = new ApolloServer<ApolloContext>({ typeDefs, resolvers })


startStandaloneServer(server, { 
  listen: { port: PORT },
  context: async (): Promise<ApolloContext> => createContext(),
})
.then(({ url }) => Log.info(`Service Apollo GraphQL is running on ${url}`))
