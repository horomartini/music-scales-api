import { Types as mongooseTypes } from 'mongoose'

declare module 'db-types' {
  export type ObjectId = mongooseTypes.ObjectId

  // export interface IRefRaw {
  //   sound: {
  //     note: mongoose.Types.ObjectId
  //     octave: number
  //     pitch: number
  //   }
  // }
  
  // export interface IRefPopulated {
  //   sound: {
  //     note: INote
  //     octave: number
  //     pitch: number
  //   }
  // }
  
  // export interface IRef {
  //   sound: ISound
  // }
  
  // export interface INoteRef {
  //   note: mongoose.Types.ObjectId
  // }
  
  // export interface IPhysicalNoteRef extends Omit<IPhysicalNote, 'name'>, INoteRef {
  
  // }
  
  // export interface ISoundRef extends Omit<ISound, 'name'>, INoteRef {
  
  // }
  
  // export interface IRef {
  //   sound: ISoundRef
  // }
}
