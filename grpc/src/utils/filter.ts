import Log from "@shared/logger"


export const comparisonOperator = {
  '<=': 'LESS_EQUALS',
  '<': 'LESS_THAN',
  '>=': 'GREATER_EQUALS',
  '>': 'GREATER_THAN',
  '!=': 'NOT_EQUALS',
  '=': 'EQUALS',
} as const

const logicalOperator = {
  'AND': 'AND',
  'OR': 'OR',
  'NOT': 'NOT',
  '-': 'NOT',
  '(': 'CONDITION_START',
  ')': 'CONDITION_END',
} as const

export const mongoOperator = {
  LESS_EQUALS: '$lte',
  LESS_THAN: '$lt',
  GREATER_EQUALS: '$gte',
  GREATER_THAN: '$gt',
  NOT_EQUALS: '$ne',
  EQUALS: '$eq',
  INCLUDES: '$in', // TODO: unused; used in mongo as `{ 5: { $in: [1, 3, 5] } } -> true`
  NOT_INCLUDES: '$nin', // TODO: unused; used in mongo as `{ 5: { $nin: [1, 3, 5] } } -> false`
  AND: '$and',
  OR: '$or',
} as const

type Keyword = 'AND' | 'OR' | 'NOT' | '-' | '(' | ')' | '>=' | '>' | '<=' | '<' | '!=' | '=' | 'FIELD' | 'VALUE' | 'LITERAL'

const validNextOperations: Record<Keyword, Keyword[]> = {
  'AND': ['NOT', '-', '(', 'FIELD', 'LITERAL'],
  'OR': ['NOT', '-', '(', 'FIELD', 'LITERAL'],
  'NOT': ['(', 'FIELD'],
  '-': ['(', 'FIELD'],
  '(': ['NOT', '-', 'FIELD', 'LITERAL'],
  ')': ['AND', 'OR', 'LITERAL'],
  '>=': ['VALUE'],
  '>': ['VALUE'],
  '<=': ['VALUE'],
  '<': ['VALUE'],
  '!=': ['VALUE'],
  '=': ['VALUE'],
  'FIELD': ['>=', '>', '<=', '<', '!=', '=', 'LITERAL'],
  'VALUE': ['AND', 'OR', ')'],
  'LITERAL': ['AND', 'OR', 'LITERAL', ')'],
} as const

const variantOperations: Keyword[] = ['FIELD', 'VALUE', 'LITERAL']

const isRecognizedOperation = (symbol: string): symbol is Keyword => symbol in validNextOperations
const isComparisonOperator = (symbol: string): symbol is keyof typeof comparisonOperator => symbol in comparisonOperator
const isLogicalOperator = (symbol: string): symbol is keyof typeof logicalOperator => symbol in logicalOperator

/**
 * Parses given filtering data and returns filter object for MongoDB
 * TODO: currently it can parse only simple queries that ONLY use simple comparisons and only AND as logical operator
 * @param str - field 'filter' from protobuf
 */
export const parseProtoToMongoFilter = (str: string): { [key: string]: any } => {
  const order: any[] = []

  let expecting: Keyword[] = ['NOT', '-', '(', 'FIELD', 'LITERAL']

  for (const text of str.split(' ')) {
    if (isRecognizedOperation(text) && !variantOperations.includes(text)) {
      const op = text

      if (!expecting.includes(op)) 
        throw new Error(`Symbol ${op} is not valid in given position`)

      if (isComparisonOperator(op)) 
        order[order.length - 1] = { [order[order.length - 1]]: comparisonOperator[op] }
      else if (isLogicalOperator(op)) 
        order.push(logicalOperator[op])
      else 
        throw new Error(`Operation '${op}' is recognized, but is neither comparison nor logical`)

      expecting = validNextOperations[op]
    }
    else {
      let op: Keyword = typeof order[order.length - 1] === 'object' ? 'VALUE' : 'FIELD'

      if (!expecting.includes(op)) 
        throw new Error(`Symbol ${op} is not valid in given position`)

      if (op === 'VALUE') {
        order[order.length - 1] = Object.entries(order[order.length - 1]).reduce((acc, [key, value]) => {
          if (typeof value === 'object')
            return { ...acc, [key]: value }
          return { ...acc, [key]: { [mongoOperator[value as keyof typeof mongoOperator]]: text } }
        }, {})
      }
      else {
        order.push(text)
      }

      expecting = validNextOperations[op]
    }
  }

  let ignoreIdxs: number[] = []
  const simple: any[] = order
    .reduce((acc, op, idx) => {
      if (order?.[idx + 1] === 'AND') {
        ignoreIdxs = [...ignoreIdxs, idx, idx + 1, idx + 2]
        return [...acc, { ...op, ...(order?.[idx + 2] ?? {}) }]
      }
      else if (ignoreIdxs.includes(idx))
        return acc
      return [...acc, op]
    }, [])
    ?.[0]

  return simple || {}
}