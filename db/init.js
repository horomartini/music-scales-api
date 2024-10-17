db = db.getSiblingDB('maindb')

db.createCollection('test')

if (db.test.countDocuments({}) === 0) {
  db.test.insertMany([
    { works: true },
  ])
}
