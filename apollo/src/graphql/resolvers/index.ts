import type { Resolvers } from '../__generated__/types'

import note from './note'
import physicalNote from './physical-note'
import instrument from './instrument'
import tuning from './tuning'
import scale from './scale'
import scalars from './scalars'

export const resolvers: Resolvers = {
  Query: {
    ...note.queryResolvers,
    ...instrument.queryResolvers,
    ...tuning.queryResolvers,
    ...scale.queryResolvers,
  },
  Mutation: {
    ...note.mutationResolvers,
    ...instrument.mutationResolvers,
    ...tuning.mutationResolvers,
    ...scale.mutationResolvers,
  },
  PhysicalNote: physicalNote.typeResolvers,
  Instrument: instrument.typeResolvers,
  Tuning: tuning.typeResolvers,
  ...scalars.scalarResolvers,
}
