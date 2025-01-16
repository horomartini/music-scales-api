import type { Request, Response, NextFunction } from 'express'
import type { ParamId, ParamUnknown, QueryFilter, QueryPaginate, QuerySort, QueryUnknown } from 'utils/requests'

import grpc from 'proto/grpc'

import { MissingParamError } from 'utils/errors'


export const checkGRPC = (_: Request, __: Response, next: NextFunction) => {
  if (!grpc.Client.isInitialized())
    throw new Error('Cannot fetch data from gRPC - client services are undefined')

  next()
}

export const validateParamId = (
  req: Request<Partial<ParamId> & ParamUnknown>,
  _: Response,
  next: NextFunction,
) => {
  const id = req.params?.id

  if (id === undefined)
    throw new MissingParamError({ message: 'ID is required.' })

  next()
}

export const parseFilters = (
  req: Request<unknown, unknown, unknown, QueryFilter & QueryUnknown>,
  res: Response,
  next: NextFunction,
) => {
  const operators = {
    _le: '<=',
    _lt: '<',
    _ge: '>=',
    _gt: '>',
    _ne: '!=',
    _eq: '=',
  } as const

  const filterString = Object
    .entries(req.query)
    .filter(([key]) => Object.keys(operators).some(op => key.endsWith(op)))
    .map(([key, val]) => {
      const op = Object.keys(operators).find(op => key.endsWith(op))!
      const field = key.slice(0, key.length - op.length)
      return `${field} ${operators[op as keyof typeof operators]} ${val}`
    })
    .join(' AND ')

  res.locals.ux = { ...res.locals.ux, filter: filterString }

  next()
}

export const parseSorters = (
  req: Request<unknown, unknown, unknown, QuerySort & QueryUnknown>,
  res: Response,
  next: NextFunction,
) => {
  const orders = {
    asc: 'asc',
    desc: 'desc',
  } as const

  const sortString = Object
    .entries(req.query)
    .filter(([_, val]) => Object.keys(orders).some(ord => val === ord))
    .map(([key, val]) => `${key} ${val}`)
    .join(',')
  
  console.log(sortString)
  res.locals.ux = { ...res.locals.ux, orderBy: sortString }

  next()
}

export const parsePagination = (
  req: Request<unknown, unknown, unknown, QueryPaginate & QueryUnknown>,
  res: Response,
  next: NextFunction,
) => {
  if (req.query.page !== undefined && req.query.limit !== undefined) {
    const n = { page: Number(req.query.page), limit: Number(req.query.limit) }
    const page = isNaN(n.page) || n.page < 1 ? 1 : n.page
    const limit = isNaN(n.limit) ? 0 : n.limit

    res.locals.ux = {
      ...res.locals.ux,
      pageSize: limit,
      pageToken: `Page ${page}`,
    }
  }

  next()
}
