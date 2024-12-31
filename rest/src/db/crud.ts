import type { InstrumentDoc, NoteDoc, ObjectId, ObjectIdField, ScaleDoc, TuningDoc } from 'types/db'
import type { Document, Model } from 'mongoose'

import { toKebabCase } from '../utils/rest'
import { hasMongo, useProto } from '../utils/env'
import { stringToObjectId } from '../utils/types'

import sampleDbJson from './data.json'


let sampleDb = sampleDbJson


export class CrudCollection<T_API extends object, T_DB extends object & ObjectIdField> {
  constructor(private name: string, private model: Model<T_DB>, private grpc?: any) {}
  
  async getOne(data: Partial<T_DB>): Promise<T_DB | null> {
    if (useProto() && this.grpc)
      return await this.grpc.getOne(data)
    return await getOne(this.name, this.model, data)
  }

  async getMany(data?: Partial<T_DB>): Promise<T_DB[]> {
    return await getMany(this.name, this.model, data)
  }
  
  async postOne(data: T_API): Promise<ObjectId | null> {
    return await postOne(this.name, this.model, data)
  }
  
  async postMany(data: T_API[]): Promise<ObjectId[]> {
    return await postMany(this.name, this.model, data)
  }
  
  async putOne(data: T_DB): Promise<void> {
    return await putOne(this.name, this.model, data)
  }
  
  async putMany(data: T_DB[]): Promise<void> {
    return await putMany(this.name, this.model, data)
  }
  
  async patchOne(data: Partial<T_DB>): Promise<void> {
    return await patchOne(this.name, this.model, data)
  }
  
  async patchMany(data: Partial<T_DB>[]): Promise<void> {
    return await patchMany(this.name, this.model, data)
  }
  
  async deleteOne(data: Pick<T_DB, '_id'>): Promise<void> {
    return await deleteOne(this.name, this.model, data)
  }
  
  async deleteMany(data: Pick<T_DB, '_id'>[]): Promise<void> {
    return await deleteMany(this.name, this.model, data)
  }
}


async function getMany<T extends object, R>(collection: string, model: Model<R>, data?: T): Promise<R[]> {
  if (!hasMongo()) 
    return getManySample<T, R>(collection, data)
  return await model.find(data || {}).exec()
}

async function getOne<T extends object, R>(collection: string, model: Model<R>, data: T): Promise<R | null> {
  if (!hasMongo()) 
    return getOneSample<T, R>(collection, data)
  return await model.findOne(data || {}).exec()
}

async function postOne<T extends object, R>(collection: string, model: Model<R>, data: T): Promise<ObjectId | null> {
  if (!hasMongo()) return postOneSample<T>(collection, data)

  // TODO: implement mongo
  return null
}

async function postMany<T extends object, R>(collection: string, model: Model<R>, data: T[]): Promise<ObjectId[]> {
  if (!hasMongo()) return postManySample<T>(collection, data)

  // TODO: implement mongo
  return []
}

async function putOne<T extends object, R>(collection: string, model: Model<R>, data: T): Promise<void> {
  if (!hasMongo()) return putOneSample<T>(collection, data)

  // TODO: implement mongo
  return
}

async function putMany<T extends object, R>(collection: string, model: Model<R>, data: T[]): Promise<void> {
  if (!hasMongo()) return putManySample<T>(collection, data)

  // TODO: implement mongo
  return
}

async function patchOne<T extends object, R>(collection: string, model: Model<R>, data: T): Promise<void> {
  if (!hasMongo()) return patchOneSample<T>(collection, data)

  // TODO: implement mongo
  return
}

async function patchMany<T extends object, R>(collection: string, model: Model<R>, data: T[]): Promise<void> {
  if (!hasMongo()) return patchManySample<T>(collection, data)

  // TODO: implement mongo
  return
}

async function deleteOne<T extends object, R>(collection: string, model: Model<R>, data: T): Promise<void> {
  if (!hasMongo()) return deleteOneSample<T>(collection, data)

  // TODO: implement mongo
  return
}

async function deleteMany<T extends object, R>(collection: string, model: Model<R>, data: T[]): Promise<void> {
  if (!hasMongo()) return deleteManySample<T>(collection, data)

  // TODO: implement mongo
  return
}


async function getManySample<T extends object, R>(collection: string, data?: T): Promise<R[]> {
  const key = collection as keyof typeof sampleDb
  const docs = (sampleDb?.[key] ?? []).filter(doc => {
    if (data === undefined)
      return true
    const givenPropertiesMatch = Object.entries(data).every(([key, value]) => {
      const docKey = key as keyof typeof doc
      return doc?.[docKey] === value
    })
    return givenPropertiesMatch
  })
  return docs as R[]
}

async function getOneSample<T extends object, R>(collection: string, data: T): Promise<R | null> {
  const docs = await getManySample<T, R>(collection)
  const doc = docs.find(doc => {
    const givenPropertiesMatch = Object.entries(data).every(([key, value]) => {
      const docKey = key as keyof typeof doc
      return doc?.[docKey] === value
    })
    return givenPropertiesMatch
  })

  return doc ?? null
}

async function postOneSample<T extends object>(collection: string, data: T): Promise<ObjectId> {
  const name = 'name' in data && typeof data.name === 'string' ? data.name : ''
  const doc = {
    ...data,
    _id: createSampleId(collection, name)
  }
  const key = collection as keyof typeof sampleDb
  sampleDb = {
    ...sampleDb,
    [collection]: [
      ...sampleDb[key],
      doc
    ]
  }

  return stringToObjectId(doc._id)
}

async function postManySample<T extends object>(collection: string, data: T[]): Promise<ObjectId[]> {
  const docs = data.map(item => {
    const name = 'name' in item && typeof item.name === 'string' ? item.name : ''
    return {
      ...item,
      _id: createSampleId(collection, name)
    }
  })
  const key = collection as keyof typeof sampleDb
  sampleDb = {
    ...sampleDb,
    [collection]: [
      ...sampleDb[key],
      ...docs
    ]
  }

  return docs.map(doc => stringToObjectId(doc._id))
}

async function putOneSample<T extends object>(collection: string, data: T): Promise<void> {
  const col = (await getManySample<T, T>(collection)).map(doc => 
    '_id' in doc && '_id' in data && doc._id === data._id 
      ? data 
      : doc
  )

  sampleDb = {
    ...sampleDb,
    [collection]: col
  }
}

async function putManySample<T extends object>(collection: string, data: T[]): Promise<void> {
  const col = (await getManySample<T, T>(collection)).map(doc => 
    data.find(item => 
      '_id' in doc && '_id' in item && doc._id === item._id
    ) ?? doc
  )

  sampleDb = {
    ...sampleDb,
    [collection]: col
  }
}

async function patchOneSample<T extends object>(collection: string, data: T): Promise<void> {
  const col = (await getManySample<T, T>(collection)).map(doc => 
    !('_id' in doc) || !('_id' in data) || doc._id !== data._id
      ? doc
      : { ...doc, ...data }
  )

  sampleDb = {
    ...sampleDb,
    [collection]: col
  }
}

async function patchManySample<T extends object>(collection: string, data: T[]): Promise<void> {
  const col = (await getManySample<T, T>(collection)).map(doc => ({
    ...doc,
    ...(data.find(item => 
      '_id' in doc && '_id' in item && doc._id === item._id
    ) ?? {})
  }))

  sampleDb = {
    ...sampleDb,
    [collection]: col
  }
}

async function deleteOneSample<T extends object>(collection: string, data: T): Promise<void> {
  const col = (await getManySample<T, T>(collection)).filter(doc => 
    !('_id' in doc) || !('_id' in data) || doc._id !== data._id
  )

  sampleDb = {
    ...sampleDb,
    [collection]: col
  }
}

async function deleteManySample<T extends object>(collection: string, data: T[]): Promise<void> {
  const col = (await getManySample<T, T>(collection)).filter(doc => 
    !data.find(item => '_id' in doc && '_id' in item && doc._id === item._id)
  )

  sampleDb = {
    ...sampleDb,
    [collection]: col
  }
}

function createSampleId(collection: string, name: string) {
  return `id.${collection}.${toKebabCase(name).replace('#', 's')}`
}
