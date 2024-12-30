import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { readFileSync } from 'fs'

import { resolvers } from './graphql/resolvers'


const typeDefs = readFileSync('./src/graphql/schema.graphql', { encoding: 'utf-8' })

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startServer()


async function startServer() {
  const { url } = await startStandaloneServer(server, { listen: { port: 4000 } })
  console.log(`Apollo Server readt at ${url}`)
}