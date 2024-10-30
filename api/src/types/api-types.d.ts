declare module 'api-types' {
  /**
   * Positive integer describing pitch of a sound in hertz (Hz), _e.g. 440_
   */
  export type Pitch = number

  export interface INote {
    name: string
  }

  export interface IPhysicalNote extends INote {
    octave: number
  }

  export interface ISound extends IPhysicalNote {
    pitch: Pitch
  }

  /* //* old code for when cyclic fields were tried
  export interface IInstrument {
    name: string
    baseNotes: number
    defaultTuning: ITuning | null
  }
  */
  export interface IInstrument {
    name: string
    baseNotes: number
    defaultTuning: string | null
  }

  /* //* old code for when cyclic fields were tried
  export interface ITuning {
    name: string
    instrument: IInstrument | null
    notes: (IPhysicalNote | null)[]
  }
  */
  export interface ITuning {
    name: string
    instrument: string | null
    notes: (IPhysicalNote | null)[]
  }

  export interface IScale {
    name: string
    keywords: string[]
    steps: number[]
  }

  export interface IRef {
    sound: ISound | null
  }
}
