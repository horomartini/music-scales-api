import type { Request, Response, NextFunction } from 'express'
import { MissingParamError } from './errors'


export type ParamUnknown = Record<string, string>

export type ParamId = {
  id: string
}


export type BodyUnknown = Record<string, unknown>


export type QueryUnknown = Record<string, string>

export type QueryFilter = {
  [field_operator: string]: string
}

export type QuerySort = {
  [field: string]: 'asc' | 'desc'
}

export type QueryPaginate = {
  page?: string
  limit?: string
}


export type LocalsUnknown = Record<string, unknown>
