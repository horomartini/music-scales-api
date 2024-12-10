import type { NoteDoc } from 'types/db'

import sampleDbJson from './data.json'
import { toKebabCase } from '../utils/rest'


const isMongo = Boolean(process.env.MONGO_URI)

let sampleDb = sampleDbJson


const getNote = async (note: Partial<NoteDoc>) => 
  await getOne<Partial<NoteDoc>, NoteDoc>('notes', note)

const getNotes = async (note?: Partial<NoteDoc>) => 
  await getMany<Partial<NoteDoc>, NoteDoc>('notes', note)

const postNote = async (note: Omit<NoteDoc, '_id'>) => 
  await postOne<Omit<NoteDoc, '_id'>>('notes', note)

const postNotes = async (notes: Omit<NoteDoc, '_id'>[]) =>
  await postMany<Omit<NoteDoc, '_id'>>('notes', notes)

const putNote = async (note: NoteDoc) => 
  await putOne<NoteDoc>('notes', note)

// db.putNotes([
//   { _id: ('id.notes.c' as unknown) as ObjectId, name: 'not C' },
//   { _id: ('id.notes.cs' as unknown) as ObjectId, name: 'not C#' }
// ])
const putNotes = async (notes: NoteDoc[]) => 
  await putMany<NoteDoc>('notes', notes)

const patchNote = async (note: Partial<NoteDoc>) => 
  await patchOne<Partial<NoteDoc>>('notes', note)

const patchNotes = async (notes: Partial<NoteDoc>[]) => 
  await patchMany<Partial<NoteDoc>>('notes', notes)

const deleteNote = async (note: Pick<NoteDoc, '_id'>) => 
  await deleteOne<Pick<NoteDoc, '_id'>>('notes', note)

const deleteNotes = async (notes: Pick<NoteDoc, '_id'>[]) => 
  await deleteMany<Pick<NoteDoc, '_id'>>('notes', notes)





async function getMany<T extends object, R>(collection: string, data?: T): Promise<R[]> {
  if (!isMongo) return getManySample<T, R>(collection, data)

  // TODO: implement mongo
  return [] as R[]
}

async function getOne<T extends object, R>(collection: string, data: T): Promise<R | null> {
  if (!isMongo) return getOneSample<T, R>(collection, data)

  // TODO: implement mongo
  return {} as R
}

async function postOne<T extends object>(collection: string, data: T): Promise<void> {
  if (!isMongo) return postOneSample<T>(collection, data)

  // TODO: implement mongo
  return
}

async function postMany<T extends object>(collection: string, data: T[]): Promise<void> {
  if (!isMongo) return postManySample<T>(collection, data)

  // TODO: implement mongo
  return
}

async function putOne<T extends object>(collection: string, data: T): Promise<void> {
  if (!isMongo) return putOneSample<T>(collection, data)

  // TODO: implement mongo
  return
}

async function putMany<T extends object>(collection: string, data: T[]): Promise<void> {
  if (!isMongo) return putManySample<T>(collection, data)

  // TODO: implement mongo
  return
}

async function patchOne<T extends object>(collection: string, data: T): Promise<void> {
  if (!isMongo) return patchOneSample<T>(collection, data)

  // TODO: implement mongo
  return
}

async function patchMany<T extends object>(collection: string, data: T[]): Promise<void> {
  if (!isMongo) return patchManySample<T>(collection, data)

  // TODO: implement mongo
  return
}

async function deleteOne<T extends object>(collection: string, data: T): Promise<void> {
  if (!isMongo) return deleteOneSample<T>(collection, data)

  // TODO: implement mongo
  return
}

async function deleteMany<T extends object>(collection: string, data: T[]): Promise<void> {
  if (!isMongo) return deleteManySample<T>(collection, data)

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
  const docs = await getMany<T, R>(collection)
  const doc = docs.find(doc => {
    const givenPropertiesMatch = Object.entries(data).every(([key, value]) => {
      const docKey = key as keyof typeof doc
      return doc?.[docKey] === value
    })
    return givenPropertiesMatch
  })

  return doc ?? null
}

async function postOneSample<T extends object>(collection: string, data: T): Promise<void> {
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

async function postManySample<T extends object>(collection: string, data: T[]): Promise<void> {
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

async function putOneSample<T extends object>(collection: string, data: T): Promise<void> {
  const col = (await getMany<T, T>(collection)).map(doc => 
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
  const col = (await getMany<T, T>(collection)).map(doc => 
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
  const col = (await getMany<T, T>(collection)).map(doc => 
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
  const col = (await getMany<T, T>(collection)).map(doc => ({
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
  const col = (await getMany<T, T>(collection)).filter(doc => 
    !('_id' in doc) || !('_id' in data) || doc._id !== data._id
  )

  sampleDb = {
    ...sampleDb,
    [collection]: col
  }
}

async function deleteManySample<T extends object>(collection: string, data: T[]): Promise<void> {
  const col = (await getMany<T, T>(collection)).filter(doc => 
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
