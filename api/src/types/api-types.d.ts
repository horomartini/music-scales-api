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
}
