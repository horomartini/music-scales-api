db = db.getSiblingDB('maindb')

db.createCollection('notes')
if (db.notes.countDocuments({}) === 0) {
  db.notes.insertMany([
    { name: 'C' },
    { name: 'C#' },
    { name: 'D' },
    { name: 'D#' },
    { name: 'E' },
    { name: 'F' },
    { name: 'F#' },
    { name: 'G' },
    { name: 'G#' },
    { name: 'A' },
    { name: 'A#' },
    { name: 'B' },
  ])
}

db.createCollection('instruments')
if (db.instruments.countDocuments({}) == 0) {
  db.instruments.insertOne({
    name: 'guitar',
    defaultTuning: null,
  })
}

db.createCollection('tunings')
if (db.tunings.countDocuments({}) === 0) {
  const guitar = db.instruments.findOne({ name: 'guitar' })
  const notesRaw = db.notes.findOne({ name: { $in: ['E', 'A', 'D', 'G', 'B'] } }).toArray()
  const notes = notesRaw.map(note => ({ [note.name]: note.name }))

  const tuning = db.tunings.insertOne({
    instrument: guitar._id,
    name: 'E Standard',
    notes: [
      { name: notes.E._id, octave: 2 },
      { name: notes.A._id, octave: 2 },
      { name: notes.D._id, octave: 3 },
      { name: notes.G._id, octave: 3 },
      { name: notes.B._id, octave: 3 },
      { name: notes.E._id, octave: 4 },
    ],
  })

  db.instruments.updateOne({ name: 'guitar' }, { $set: { defaultTuning: tuning.insertedId } })
}

db.createCollection('scales')
if (db.scales.countDocuments({}) === 0) {
  db.scales.insertOne({
    name: 'Major (Ionian)',
    steps: [2, 2, 1, 2, 2, 2, 1],
  })
}

// db.createCollection('refs')
// if (db.refs.countDocuments({}) === 0) {
//   const noteA = db.notes.findOne({ name: 'A' })

//   db.refs.insertOne({
//     sound: {
//       note: noteA._id,
//       octave: 4,
//       pitch: 440,
//     }
//   })
// }
