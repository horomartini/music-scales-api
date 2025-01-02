import type { SortOrder } from 'mongoose'

export const order: Record<string, SortOrder> = {
  asc: 1,
  desc: -1,
} as const

/**
 * Parses given ordering data and returns fields to be ordered against with positive/negative values for ascending/descending order.
 * @param str - field 'order_by' from protobuf
 */
export const parseProtoToMongoSort = (str: string): { [key: string]: SortOrder } => {
  return str
    .split(',')
    .reduce((acc, component) => {
      if (component === '')
        return acc
      
      const [field, dir] = component.trim().split(' ')
      return { ...acc, [field]: dir === 'desc' ? order.desc : order.asc }
    }, {})
}