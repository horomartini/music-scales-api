import type { NoteDoc } from 'types/db'

import sampleDbJson from './data.json'
import { toKebabCase } from '../utils/rest'


const isMongo = Boolean(process.env.MONGO_URI)

let sampleDb = sampleDbJson


const getNote = (note: Partial<NoteDoc>) => 
  getOne<Partial<NoteDoc>, NoteDoc>('notes', note)

const getNotes = (note?: Partial<NoteDoc>) => 
  getMany<Partial<NoteDoc>, NoteDoc>('notes', note)

const postNote = (note: Omit<NoteDoc, '_id'>) => 
  postOne<Omit<NoteDoc, '_id'>>('notes', note)

const postNotes = (notes: Omit<NoteDoc, '_id'>[]) =>
  postMany<Omit<NoteDoc, '_id'>>('notes', notes)

const putNote = (note: NoteDoc) => 
  putOne<NoteDoc>('notes', note)

// db.putNotes([
//   { _id: ('id.notes.c' as unknown) as ObjectId, name: 'not C' },
//   { _id: ('id.notes.cs' as unknown) as ObjectId, name: 'not C#' }
// ])
const putNotes = (notes: NoteDoc[]) => 
  putMany<NoteDoc>('notes', notes)

const patchNote = (note: Partial<NoteDoc>) => 
  patchOne<Partial<NoteDoc>>('notes', note)

const patchNotes = (notes: Partial<NoteDoc>[]) => 
  patchMany<Partial<NoteDoc>>('notes', notes)

const deleteNote = (note: Pick<NoteDoc, '_id'>) => 
  deleteOne<Pick<NoteDoc, '_id'>>('notes', note)

const deleteNotes = (notes: Pick<NoteDoc, '_id'>[]) => 
  deleteMany<Pick<NoteDoc, '_id'>>('notes', notes)





function getMany<T extends object, R>(collection: string, data?: T): R[] {
  if (!isMongo) return getManySample<T, R>(collection, data)

  // TODO: implement mongo
  return [] as R[]
}

function getOne<T extends object, R>(collection: string, data: T): R | null {
  if (!isMongo) return getOneSample<T, R>(collection, data)

  // TODO: implement mongo
  return {} as R
}

function postOne<T extends object>(collection: string, data: T) {
  if (!isMongo) return postOneSample<T>(collection, data)

  // TODO: implement mongo
  return
}

function postMany<T extends object>(collection: string, data: T[]) {
  if (!isMongo) return postManySample<T>(collection, data)

  // TODO: implement mongo
  return
}

function putOne<T extends object>(collection: string, data: T) {
  if (!isMongo) return putOneSample<T>(collection, data)

  // TODO: implement mongo
  return
}

function putMany<T extends object>(collection: string, data: T[]) {
  if (!isMongo) return putManySample<T>(collection, data)

  // TODO: implement mongo
  return
}

function patchOne<T extends object>(collection: string, data: T) {
  if (!isMongo) return patchOneSample<T>(collection, data)

  // TODO: implement mongo
  return
}

function patchMany<T extends object>(collection: string, data: T[]) {
  if (!isMongo) return patchManySample<T>(collection, data)

  // TODO: implement mongo
  return
}

function deleteOne<T extends object>(collection: string, data: T) {
  if (!isMongo) return deleteOneSample<T>(collection, data)

  // TODO: implement mongo
  return
}

function deleteMany<T extends object>(collection: string, data: T[]) {
  if (!isMongo) return deleteManySample<T>(collection, data)

  // TODO: implement mongo
  return
}


function getManySample<T extends object, R>(collection: string, data?: T): R[] {
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

function getOneSample<T extends object, R>(collection: string, data: T): R | null {
  const docs = getMany<T, R>(collection)
  const doc = docs.find(doc => {
    const givenPropertiesMatch = Object.entries(data).every(([key, value]) => {
      const docKey = key as keyof typeof doc
      return doc?.[docKey] === value
    })
    return givenPropertiesMatch
  })

  return doc ?? null
}

function postOneSample<T extends object>(collection: string, data: T) {
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
}

function postManySample<T extends object>(collection: string, data: T[]) {
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
}

function putOneSample<T extends object>(collection: string, data: T) {
  const col = getMany<T, T>(collection).map(doc => 
    '_id' in doc && '_id' in data && doc._id === data._id 
      ? data 
      : doc
  )

  sampleDb = {
    ...sampleDb,
    [collection]: col
  }
}

function putManySample<T extends object>(collection: string, data: T[]) {
  const col = getMany<T, T>(collection).map(doc => 
    data.find(item => 
      '_id' in doc && '_id' in item && doc._id === item._id
    ) ?? doc
  )

  sampleDb = {
    ...sampleDb,
    [collection]: col
  }
}

function patchOneSample<T extends object>(collection: string, data: T) {
  const col = getMany<T, T>(collection).map(doc => 
    !('_id' in doc) || !('_id' in data) || doc._id !== data._id
      ? doc
      : { ...doc, ...data }
  )

  sampleDb = {
    ...sampleDb,
    [collection]: col
  }
}

function patchManySample<T extends object>(collection: string, data: T[]) {
  const col = getMany<T, T>(collection).map(doc => ({
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

function deleteOneSample<T extends object>(collection: string, data: T) {
  const col = getMany<T, T>(collection).filter(doc => 
    !('_id' in doc) || !('_id' in data) || doc._id !== data._id
  )

  sampleDb = {
    ...sampleDb,
    [collection]: col
  }
}

function deleteManySample<T extends object>(collection: string, data: T[]) {
  const col = getMany<T, T>(collection).filter(doc => 
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


export default {
  getNote,
  getNotes,
  postNote,
  postNotes,
  putNote,
  putNotes,
  patchNote,
  patchNotes,
  deleteNote,
  deleteNotes,
}
