db = db.getSiblingDB('maindb')

db.createCollection('Note')
if (db.Note.countDocuments({}) === 0) {
  db.Note.insertMany([
    { name: "C" },
    { name: "C#" },
    { name: "D" },
    { name: "D#" },
    { name: "E" },
    { name: "F" },
    { name: "F#" },
    { name: "G" },
    { name: "G#" },
    { name: "A" },
    { name: "A#" },
    { name: "B" },
  ])
}

db.createCollection('Ref')
if (db.Ref.countDocuments({}) === 0) {
  const noteA = db.Note.findOne({ name: 'A' })

  db.Ref.insert({
    sound: {
      note: noteA._id,
      octave: 4,
      pitch: 440,
    }
  })
}
