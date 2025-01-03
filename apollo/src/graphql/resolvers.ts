import { variedPrimitiveScalar } from './scalars'


export const resolvers = {
  Query: {
    getNote: async (_: unknown, {}) => {
      
    }
  },
  Mutation: {

  },
  Instrument: {

  },
  Tuning: {

  },
  PhysicalNote: {

  },
  VariedPrimitive: variedPrimitiveScalar,
}