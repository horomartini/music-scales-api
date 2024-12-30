import type { Request } from 'express'

import * as func from '../params'

describe('yyy', () => {
  it('true', () => { expect(true).toBe(true) })
  // it('ttt', () => {
  //   type TestNote = { name: string }

  //   const req = {
  //     'note': 'A',
  //     'keys': 'E,F',
  //     'filter_by': 'name',
  //     'filter_for': '',
  //     'order': 'desc',
  //     'page': '',
  //     'hateoas': undefined,
  //   }

  //   const ref = {
  //     note: { type: Object, defaultValue: null, parser: (v: string): TestNote => ({ name: v }) },
  //     keys: { type: [String], defaultValue: null },
  //     filterBy: { type: String, defaultValue: '' },
  //     filterFor: { type: String, defaultValue: '' },
  //     order: { type: ['asc', 'desc'], defaultValue: 'asc' },
  //     page: { type: Number, defaultValue: -1 },
  //     hateoas: { type: Boolean, defaultValue: false },
  //   }

  //   const result = func.parseQueryParams(req, ref)
  // })

  // let req = {}

  // beforeEach(() => {
  //   req = {
  //     headers: {},
  //     params: {},
  //     query: {},
  //     body: {},
  //     method: 'GET',
  //     url: '',
  //     path: '',
  //     baseUrl: '',
  //     cookies: {},
  //   } as Request
  // })

  // it('', () => {
  //   const ref = {
  //     filterBy: [String(), ''] as [string, string],
  //     filterFor: [String(), ''] as [string, string], 
  //     order: [['asc', 'desc'], 'asc'] as [string[], string],
  //     page: [Number(), -1] as [number, number],
  //     hateoas: [Boolean(), false] as [boolean, boolean],
  //   }
  //   req = {
  //     ...req,
  //     query: {
  //       'filter_by': 'name',
  //       'filter_for': '',
  //       'order': 'desc',
  //       'page': '',
  //       'hateoas': undefined,
  //     }
  //   }
  //   const result = func.getQueryParams(ref, req as Request)
  // })
})