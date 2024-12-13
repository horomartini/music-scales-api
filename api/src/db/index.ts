import type { Instrument, Note } from 'types/api'
import type { InstrumentDoc, NoteDoc } from 'types/db'

import { CrudCollection } from './crud'

export default {
  notes: new CrudCollection<Note, NoteDoc>('notes'),
  instruments: new CrudCollection<Instrument, InstrumentDoc>('instruments'),
}
