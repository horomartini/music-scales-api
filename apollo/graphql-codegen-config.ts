
import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: './src/graphql/schema.graphql',
  generates: {
    './src/graphql/__generated__/types.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        useIndexSignature: true,
        contextType: '../context#ApolloContext',
        scalars: {
          VariedPrimitive: '../scalars#VariedPrimitive'
        }
      }
    },
    './src/graphql/__generated__/graphql.schema.json': {
      plugins: ['introspection']
    }
  }
}

export default config
