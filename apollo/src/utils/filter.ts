import type { FilteringInput, InputMaybe } from '../graphql/__generated__/types'

import { FilterOperator } from '../graphql/__generated__/types'


const namedOpToSymbolOp = (op?: FilterOperator): string => {
  switch (op) {
    case FilterOperator.LessEquals: return '<='
    case FilterOperator.LessThan: return '<'
    case FilterOperator.GreaterEquals: return '>='
    case FilterOperator.GreaterThan: return '>'
    case FilterOperator.NotEquals: return '!='
    case FilterOperator.Equals: return '='
    default: throw new Error(`Unknown FilterOperator: ${op} - cannot parse to symbol`)
  }
}

export const parseFilterToString = (filter: InputMaybe<FilteringInput> | undefined): string => {
  if (filter === null || filter === undefined)
    return ''

  if (filter?.singleFieldFilter !== undefined) {
    const field = filter.singleFieldFilter?.field ?? ''
    const operation = namedOpToSymbolOp(filter.singleFieldFilter?.operation)
    const value = filter.singleFieldFilter?.value ?? ''

    return `${field} ${operation.toUpperCase()} ${value}`
  }

  return filter?.withString ?? ''
}
