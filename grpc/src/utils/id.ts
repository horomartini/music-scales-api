import mongoose from 'mongoose'

export const parseProtoToMongoId = (id: string): [null, mongoose.Types.ObjectId] | [string, null] => {
  if (mongoose.Types.ObjectId.isValid(id))
    return [null, new mongoose.Types.ObjectId(id)]
  return [`Id '${id}' is not a valid ObjectId`, null]
}