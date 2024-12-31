import { readFileSync } from 'fs'
import { resolvers } from './resolvers'

const typeDefs = readFileSync('./src/graphql-data/schema.graphql', { encoding: 'utf-8' })

export default {
  typeDefs,
  resolvers
}