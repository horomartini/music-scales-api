import { GraphQLScalarType, Kind, ValueNode } from 'graphql'


export type VariedPrimitive = 
  | number 
  | string 
  | boolean

export type VariedPrimitiveKind = 
  | { kind: Kind.INT, value: string } 
  | { kind: Kind.FLOAT, value: string } 
  | { kind: Kind.STRING, value: string } 
  | { kind: Kind.BOOLEAN, value: boolean }


const variedPrimitiveAsValue = ['number', 'string', 'boolean']
const variedPrimitiveAsKind = [Kind.INT, Kind.FLOAT, Kind.STRING, Kind.BOOLEAN]

const isVariedPrimitiveAsValue = (x: unknown): x is VariedPrimitive => variedPrimitiveAsValue.includes(typeof x)
const isVariedPrimitiveAsKind = (x: ValueNode): x is VariedPrimitiveKind => variedPrimitiveAsKind.includes(x.kind)


export const variedPrimitiveScalar = new GraphQLScalarType<VariedPrimitive>({
  name: 'VariedPrimitive',
  description: `Multi-type scalar for storing values of any supported primitive type. Supported types are ${variedPrimitiveAsValue.join(' | ')}.`,
  serialize(value): VariedPrimitive {
    if (isVariedPrimitiveAsValue(value))
      return value
    throw new Error(`GraphQL VariedPrimitive Scalar serializer expected a '${variedPrimitiveAsValue.join(' | ')}' type`)
  },
  parseValue(value): VariedPrimitive {
    if (isVariedPrimitiveAsValue(value))
      return value
    throw new Error(`GraphQL VariedPrimitive Scalar parser expected a '${variedPrimitiveAsValue.join(' | ')}' type`)
  },
  parseLiteral(ast): VariedPrimitive {
    if (isVariedPrimitiveAsKind(ast))
      return ast.kind === Kind.INT || ast.kind === Kind.FLOAT ? Number(ast.value) : ast.value
    return ''
  },
})
