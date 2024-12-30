import type { IInstrument, INote, IPhysicalNote, IScale, ISound, ITuning } from 'api-types'

import { Types as mongooseTypes } from 'mongoose'


declare module 'db-types' {
  export type ObjectId = mongooseTypes.ObjectId
  export type MongolessObjectId = string

  export interface IMongolessObjectIdField {
    '_id': MongolessObjectId
  }

  export interface INotesCollection extends INote, IMongolessObjectIdField {}

  /* //* old code for when cyclic fields were tried
  export interface IInstrumentsCollection extends Omit<IInstrument, 'defaultTuning'>, IMongolessObjectIdField {
    defaultTuning: MongolessObjectId
  }
  */
  export interface IInstrumentsCollection extends Omit<IInstrument, 'defaultTuning'>, IMongolessObjectIdField {
    defaultTuning: MongolessObjectId
  }

  /* //* old code for when cyclic fields were tried
  export interface ITuningsCollection extends Omit<ITuning, 'instrument' | 'notes'>, IMongolessObjectIdField {
    instrument: MongolessObjectId
    notes: (Omit<IPhysicalNote, 'name'> & { note: MongolessObjectId })[]
  }
  */
  export interface ITuningsCollection extends Omit<ITuning, 'instrument' | 'notes'>, IMongolessObjectIdField {
    instrument: MongolessObjectId
    notes: (Omit<IPhysicalNote, 'name'> & { note: MongolessObjectId })[]
  }

  export interface IScalesCollection extends IScale, IMongolessObjectIdField {}

  export interface IRefsCollection extends Omit<IRef, 'sound'>, IMongolessObjectIdField {
    sound: Omit<ISound, 'name'> & { note: MongolessObjectId } & IMongolessObjectIdField
  }
}
