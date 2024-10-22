import mongoose from 'mongoose'


export interface INote {
  name: string
}

export interface IPhysicalNote extends INote {
  octave: number
}

export interface ISound extends IPhysicalNote {
  pitch: number
}

export interface INoteRef {
  note: mongoose.Types.ObjectId
}

export interface IPhysicalNoteRef extends Omit<IPhysicalNote, 'name'>, INoteRef {

}

export interface ISoundRef extends Omit<ISound, 'name'>, INoteRef {

}

export interface IRef {
  sound: ISoundRef
}