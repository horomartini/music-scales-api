import type { Instrument, Note, Scale, Tuning } from 'types/api'
import type { InstrumentDoc, NoteDoc, ScaleDoc, TuningDoc } from 'types/db'

import { CrudCollection } from './crud'

export default {
  notes: new CrudCollection<Note, NoteDoc>('notes'),
  instruments: new CrudCollection<Instrument, InstrumentDoc>('instruments'),
  tunings: new CrudCollection<Tuning, TuningDoc>('tunings'),
  scales: new CrudCollection<Scale, ScaleDoc>('scales'),
}
