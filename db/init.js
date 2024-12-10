const maindb = db.getSiblingDB('maindb')

if (maindb.notes.countDocuments({}) === 0) {
  maindb.notes.insertMany([
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

if (maindb.instruments.countDocuments({}) === 0) {
  db.instruments.insertOne({
    name: 'guitar',
    defaultTuning: null,
  })
}

if (maindb.tunings.countDocuments({}) === 0) {
  const guitar = db.instruments.findOne({ name: 'guitar' })
  const notes = db.notes
    .find({ name: { $in: ['E', 'A', 'D', 'G', 'B'] } })
    .toArray()
    .reduce((acc, note) => ({ ...acc, [note.name]: { _id: note._id } }), {})
  
  console.log(notes)
  console.log(notes.E)
  console.log(notes.E._id)

  const { insertedId: tuningId } = db.tunings.insertOne({
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

  db.instruments.updateOne(
    { name: 'guitar' }, 
    { $set: { defaultTuning: tuningId } }
  )
}

if (maindb.scales.countDocuments({}) === 0) {
  maindb.scales.insertOne({
    name: 'Major (Ionian)',
    steps: [2, 2, 1, 2, 2, 2, 1],
  })
}

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
