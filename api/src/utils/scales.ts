import type { INote, IPhysicalNote, IScale, ISound } from 'api-types'

export const stepsToNotes = (
  rootKey: string,
  steps: number[],
  notes: INote[],
): string[] => {
  const notesArr: string[] = notes.map(note => note.name)
  let idx = notesArr.indexOf(rootKey)

  return steps.map(step => {
    const note = notesArr[idx]
    
    idx += step
    if (idx >= notesArr.length)
      idx -= notesArr.length

    return note
  })
}