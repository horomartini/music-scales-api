import type { Resolvers } from '../__generated__/types'

import { variedPrimitiveScalar } from '../scalars'


const scalarResolvers: Pick<Resolvers, 'VariedPrimitive'> = {
  VariedPrimitive: variedPrimitiveScalar,
}


export default {
  scalarResolvers
}
