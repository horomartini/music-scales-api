import type { CrudInterface, NoteDoc } from 'types/db'

import mongoose from 'mongoose'

import { Notes } from '../model'

import { parseProtoToMongoFilter } from '../../utils/filter'
import { parseProtoToMongoSort } from '../../utils/order'


export const noteCrud = {
  getOne: async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new Error(`Given id '${id}' is not a valid ObjectId`)

    return { id: '1', name: 'test' }
    // return await Notes.findById(id).exec()
  },
  getMany: async (filter: string, orderBy: string, pageSize: number = 50, pageToken: string = 'Page 1') => {
    const query = parseProtoToMongoFilter(filter)
    const sort = parseProtoToMongoSort(orderBy)
    const limit = pageSize
    const skip = limit * (Number(pageToken.split(' ')?.[1] ?? 1) - 1)

    return [{ id: '1', name: 'test' }]
    // return await Notes.find(query).sort(sort).limit(limit).skip(skip).exec()
  }
}