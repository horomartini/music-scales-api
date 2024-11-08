import { INote, IPhysicalNote } from "api-types"

export const parseNotes = (notes: string) => {
  const notesArr: string[] = notes.split(',') || []

  const notesObjs: (IPhysicalNote | INote)[] = notesArr.map(note => {
    if (/\d/.test(note))
      return {
        name: note.slice(0, -1).replace('s', '#'),
        octave: Number(note.slice(-1)),
      } as IPhysicalNote
    return { name: note } as INote
  })

  return notesObjs
}