import type { InputMaybe, SortingInput } from '../graphql/__generated__/types'


export const parseSortToString = (sort: InputMaybe<SortingInput> | undefined): string => {
  if (sort === null || sort === undefined)
    return ''

  if (sort?.singleFieldSort !== undefined) {
    const field = sort.singleFieldSort?.field ?? ''
    const order = sort.singleFieldSort?.order ?? ''

    return `${field} ${order.toLowerCase()}`
  }

  return sort?.withString ?? ''
}
