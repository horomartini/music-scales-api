import { GraphQLScalarType, Kind, ValueNode } from 'graphql'


export type FilterForType = 
  | string 
  | number 
  | boolean

export type FilterForTypeKind = 
  | { kind: Kind.INT, value: string } 
  | { kind: Kind.FLOAT, value: string } 
  | { kind: Kind.STRING, value: string } 
  | { kind: Kind.BOOLEAN, value: boolean }

const filterForTypeAsValue = ['string', 'number', 'boolean']
const filterForTypeAsKind = [Kind.INT, Kind.FLOAT, Kind.STRING, Kind.BOOLEAN]

const isFilterForTypeAsValue = (x: unknown): x is FilterForType => filterForTypeAsValue.includes(typeof x)
const isFilterForTypeAsKind = (x: ValueNode): x is FilterForTypeKind => filterForTypeAsKind.includes(x.kind)

export const filterForTypeScalar = new GraphQLScalarType<FilterForType>({
  name: 'FilterForType',
  description: `Multi-type scalar type for passing value to filter against in specific way, specified by FilterType. Supported types are ${filterForTypeAsValue.join(' | ')}.`,
  serialize(value): FilterForType {
    if (isFilterForTypeAsValue(value))
      return value
    throw new Error(`GraphQL FilterForType Scalar serializer expected a '${filterForTypeAsValue.join(' | ')}' type`)
  },
  parseValue(value): FilterForType {
    if (isFilterForTypeAsValue(value))
      return value
    throw new Error(`GraphQL FilterForType Scalar parser expected a '${filterForTypeAsValue.join(' | ')}' type`)
  },
  parseLiteral(ast): FilterForType {
    if (isFilterForTypeAsKind(ast))
      return ast.kind === Kind.INT || ast.kind === Kind.FLOAT ? Number(ast.value) : ast.value
    return ''
  },
})