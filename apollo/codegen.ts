
import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: "./src/graphql/schema.graphql",
  generates: {
    "./src/graphql/generated/types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        scalars: {
          VariedPrimitive: "../scalars#VariedPrimitive"
        }
      }
    },
    "./src/graphql/generated/graphql.schema.json": {
      plugins: ["introspection"]
    }
  }
}

export default config
