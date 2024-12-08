export type Pitch = number
export type Octave = number

export type Note = {
  name: string
}

export type PhysicalNote = Note & {
  octave: Octave
}

export type Sound = PhysicalNote & {
  pitch: Pitch
}

export type Instrument = {
  name: string
  defaultTuning: string | null
}

export type Tuning = {
  name: string
  instrument: string | null
  notes: PhysicalNote[] | null
}

export type Scale = {
  name: string
  steps: number[]
}

export type ScaleExt = {
  name: string
  tonic: string
  notes: string[]
}
