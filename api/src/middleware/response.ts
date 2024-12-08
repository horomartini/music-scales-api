import type { Request, Response, NextFunction } from 'express'
import type { QueryFilter, QueryPaginator, QuerySorter, QueryUnknown } from 'types/req'


export const applyFiltering = <T>(
  req: Request<{}, {}, {}, QueryUnknown & Partial<QueryFilter>>, 
  res: Response<{}, { data: T[] }>, 
  next: NextFunction,
) => {
  const { filter_by: filterBy, filter_for: filterFor } = req.query
  
  if (filterBy === undefined || filterFor === undefined)
    next()

  let data: T[] = res.locals.data ?? []
  const key = filterBy as keyof typeof data[number]

  data = data.filter(obj => obj?.[key] && obj[key] === filterFor)

  res.locals.data = data
  next()
}

export const applySorting = <T>(
  req: Request<{}, {}, {}, QueryUnknown & Partial<QuerySorter>>,
  res: Response<{}, { data: T[] }>,
  next: NextFunction,
) => {
  const { sort_by: sortBy, order, group_by: groupBy } = req.query

  if (sortBy === undefined || order === undefined)
    next()

  let data: T[] = res.locals.data ?? []
  const dir = order === 'asc' ? 1 : -1
  const key = sortBy as keyof typeof data[number]

  data = data.sort((a, b) => {
    const aV = a?.[key]
    const bV = b?.[key]

    if (aV === undefined || aV === null || bV === undefined || bV === null)
      return 1

    const v = aV < bV ? -1 : 1
    return v * dir
  })

  res.locals.data = data
  next()
}

export const applyPagination = <T>(
  req: Request<{}, {}, {}, QueryUnknown & Partial<QueryPaginator>>,
  res: Response<{}, { data: T[] }>,
  next: NextFunction,
) => {
  const { page: pageStr, limit: limitStr } = req.query

  if (pageStr === undefined || limitStr === undefined)
    next()

  let data: T[] = res.locals.data ?? []
  const page = isNaN(Number(pageStr)) ? 0 : Number(pageStr)
  const limit = isNaN(Number(limitStr)) ? 0 : Number(limitStr)
  const itemMul = limit < 1 ? 1 : limit  // item per page multiplier
  const start = page < 2 ? 0 : (page - 1) * itemMul 
  const end = limit < 1 ? undefined : page * itemMul

  data = data.slice(start, end)

  res.locals.data = data
  next()
}
