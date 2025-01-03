import mongoose from 'mongoose'

import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { readFileSync } from 'fs'

import { resolvers } from './graphql/resolvers'


interface GraphQLContext {
  dataSources: {
    
  }
}


const PORT = Number(process.env.PORT || 4000)
// const MONGO_URI = process.env.MONGO_URI || undefined

const typeDefs = readFileSync('./src/graphql/schema.graphql', { encoding: 'utf-8' })


const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startServer()


async function startServer() {
  const { url } = await startStandaloneServer(server, { listen: { port: PORT } })
  console.info(`Apollo Server readt at ${url}`)

  // if (MONGO_URI === undefined)
  //   console.warn('MONG_URI has not been defined - connection to database will not be established!')
  // else 
  //   mongoose
  //     .connect(MONGO_URI, {})
  //     .then(() => { 
  //       console.info('Connected to db') 
  //     })
  //     .catch(error => { 
  //       console.error('Error connecting to db:', error.message) 
  //     })
}