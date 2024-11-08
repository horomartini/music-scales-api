import type { INote, IPhysicalNote, IScale, IScaleExt, ISound } from 'api-types'

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

export const scaleToScaleExt = (
  scale: IScale,
  notes: INote[],
  filterKeys: (INote | IPhysicalNote | ISound)[],
): IScaleExt[] => {
  const scalesExt: IScaleExt[] = notes.map(note => ({
    name: scale.name,
    keywords: scale.keywords,
    key: note.name,
    notes: stepsToNotes(note.name, scale.steps, notes),
  }))

  if (filterKeys.length < 0)
    return scalesExt
  return scalesExt.filter(extScale => filterKeys
    .map(note => note.name)
    .every(noteName => extScale.notes.includes(noteName))
  )
}