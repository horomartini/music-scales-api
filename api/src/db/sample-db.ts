import type { 
  IInstrumentsCollection, 
  INotesCollection, 
  IRefsCollection, 
  IScalesCollection, 
  ITuningsCollection, 
} from 'db-types'
import type { 
  IInstrument,
  INote,
  IPhysicalNote,
  IRef,
  IScale,
  ISound,
  ITuning, 
} from 'api-types'
import sampleDb from './data.json'

const DB = sampleDb

const getNotes = () => {
  const notesCol: INotesCollection[] = DB.notes
  const notes: INote[] = notesCol
    .map(({ _id, ...rest }) => ({ ...rest }))
  return notes
}

const getNote = (name: string): INote | null => {
  return getNotes()
    .filter(note => note.name === name)
    ?.[0] || null
}

const getInstruments = () => {
  /* //* old code for when cyclic fields were tried
  const instrumentsCol: IInstrumentsCollection[] = sampleDb.instruments
  const tuningsCol: ITuningsCollection[] = sampleDb.tunings
  const notesCol: INotesCollection[] = sampleDb.notes

  const instruments: IInstrument[] = instrumentsCol
    .map(({ _id, ...rest }) => ({ ...rest }))
    .map(({ defaultTuning, ...rest }) => {
      const tuningMatches = tuningsCol
        .filter(tuningRef => tuningRef._id === defaultTuning)
        .map(({ _id, ...rest }) => ({ 
          ...rest, 
          instrument: null,
          notes: rest.notes
            .map(({ note, octave }) => {
              const notesMatches = notesCol
                .filter(noteRef => noteRef._id === note)
                .map(({ _id, ...rest }) => ({ ...rest }))
              return notesMatches.length === 0
                ? null
                : { name: notesMatches[0].name, octave }
            }),
        }))
      const tuning = tuningMatches.length === 0 ? null : tuningMatches[0]
      return { ...rest, defaultTuning: tuning }
    })
  
  return instruments
  */
  const instrumentsCol: IInstrumentsCollection[] = DB.instruments
  const tuningsCol: ITuningsCollection[] = DB.tunings

  const instruments: IInstrument[] = instrumentsCol
    .map(({ _id, ...rest }) => ({ ...rest }))
    .map(({ defaultTuning, ...rest }) => {
      const tuningMatches: Pick<ITuning, 'name'>[] = tuningsCol
        .filter(tuningRef => tuningRef._id === defaultTuning)
        .map(({ name }) => ({ name }))
      const tuningName = tuningMatches.length === 0 
        ? null 
        : tuningMatches[0].name
      return { ...rest, defaultTuning: tuningName }
    })
  return instruments
}

const getInstrument = (name: string): IInstrument | null => {
  return getInstruments()
    .filter(instrument => instrument.name === name)
    ?.[0] || null
}

const getTunings = () => {
  /* //* old code for when cyclic fields were tried
  const tuningsCol: ITuningsCollection[] = sampleDb.tunings
  const instrumentsCol: IInstrumentsCollection[] = sampleDb.instruments
  const notesCol: INotesCollection[] = sampleDb.notes

  const tunings: ITuning[] = tuningsCol
    .map(({ _id, ...rest }) => ({ ...rest }))
    .map(({ instrument, ...rest }) => {
      const instrumentMatches = instrumentsCol
        .filter(instrumentRef => instrumentRef._id === instrument)
        .map(({ _id, ...rest }) => ({ ...rest, defaultTuning: null }))
      const instrumentEl = instrumentMatches.length === 0 ? null : instrumentMatches[0]
      const notes = rest.notes
        .map(({ note, octave }) => {
          const notesMatches = notesCol
            .filter(notesRef => notesRef._id === note)
            .map(({ _id, ...rest }) => ({ ...rest }))
          return notesMatches.length === 0
            ? null
            : { name: notesMatches[0].name, octave }
        })
      return { ...rest, instrument: instrumentEl, notes: notes }
    })
  
  return tunings
  */
  const tuningsCol: ITuningsCollection[] = DB.tunings
  const instrumentsCol: IInstrumentsCollection[] = DB.instruments
  const notesCol: INotesCollection[] = DB.notes

  const tunings: ITuning[] = tuningsCol
    .map(({ _id, ...rest }) => ({ ...rest }))
    .map(({ instrument, notes, ...rest }) => {
      const instrumentMatches: Pick<IInstrument, 'name'>[] = instrumentsCol
        .filter(instrumentRef => instrumentRef._id === instrument)
        .map(({ name }) => ({ name }))
      const instrumentName = instrumentMatches.length === 0 
        ? null 
        : instrumentMatches[0].name
      const notesMapped: (IPhysicalNote | null)[] = notes
        .map(({ note, ...rest }) => {
          const noteMatches: Pick<INote, 'name'>[] = notesCol
            .filter(noteRef => noteRef._id === note)
            .map(({ _id, ...rest }) => ({ ...rest }))
          return noteMatches.length === 0
            ? null
            : { ...rest, name: noteMatches[0].name }
        })
      return { ...rest, instrument: instrumentName, notes: notesMapped }
    })
  return tunings
}

const getTuning = (name: string): ITuning | null => {
  return getTunings()
    .filter(tuning => tuning.name === name)
    ?.[0] || null
}

const getScales = () => {
  const scalesCol: IScalesCollection[] = DB.scales
  const scales: IScale[] = scalesCol
    .map(({ _id, ...rest }) => ({ ...rest }))
  return scales
}

const getScale = (name: string): IScale | null => {
  return getScales()
    .filter(scale => scale.name === name)
    ?.[0] || null
}

const getRefs = () => {
  const refsCol: IRefsCollection[] = DB.refs
  const notesCol: INotesCollection[] = DB.notes

  const refs: IRef[] = refsCol
    .map(({ _id, ...rest }) => ({ ...rest }))
    .map(({ sound, ...rest }) => {
      const noteMatches: Pick<INote, 'name'>[] = notesCol
        .filter(noteRef => noteRef._id === sound.note)
        .map(({ name }) => ({ name }))
      const noteName: string | null = noteMatches.length === 0
        ? null
        : noteMatches[0].name
      const soundMapped: ISound | null = noteName === null
        ? null
        : [sound].map(({ _id, note, ...rest }) => ({ ...rest, name: noteName }))[0]
      return { ...rest, sound: soundMapped }
    })
  return refs
}

const getRef = (): IRef | null => {
  return getRefs()?.[0] || null
}

export default {
  getNotes,
  getNote,
  getInstruments,
  getInstrument,
  getTunings,
  getTuning,
  getScales,
  getScale,
  getRefs,
  getRef,
}
