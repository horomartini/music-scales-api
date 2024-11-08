export const applyFiltering = <T extends { [key: string]: any }>(
  objects: T[], 
  target: string, 
  value: any
): T[] => {
  return objects
    .filter(obj => obj?.[target] && obj[target] === value)
}

export const applySorting = <T extends { [key: string]: any }>(
  objects: T[], 
  target: string, 
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  const dir = order === 'asc' ? 1 : -1
  return objects
    .sort((a, b) => (a?.[target] < b?.[target] ? -1 : 1) * dir)
}

export const applyPagination = <T extends { [key: string]: any }>(
  objects: T[], 
  page: number,
  limit: number,
): T[] => {
  const itemMul = limit < 1 ? 1 : limit
  const start = page < 2 ? 0 : (page - 1) * itemMul
  const end = limit < 1 ? undefined : page * itemMul

  return objects
    .slice(start, end)
}
