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

export interface IRefRaw {
  sound: {
    note: mongoose.Types.ObjectId
    octave: number
    pitch: number
  }
}

export interface IRefPopulated {
  sound: {
    note: INote
    octave: number
    pitch: number
  }
}

export interface IRef {
  sound: ISound
}

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