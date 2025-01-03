import Log from "@shared/logger"


export const parseProtoToMongoLimit = (pageSize: number) => pageSize < 1 ? 50 : pageSize

const parseProtoPageToken = (pageToken: string) => Number(pageToken.split(' ')?.[1] ?? 1)

export const parseProtoToMongoSkip = (pageToken: string, limit: number) => {
  const page = parseProtoPageToken(pageToken)
  
  if (page < 1)
    return 0
  return limit * (page - 1)
}

export const getProtoPaginationData = (limit: number, skip: number, queriedCount: number): [null, { nextPageToken: string, totalPages: number }] | [string, { nextPageToken: string, totalPages: number }] => {
  const totalPages = Math.ceil(queriedCount / limit)

  if (queriedCount <= skip)  {
    Log.error(`Page out of bounds, queriedCount(${queriedCount}) <= skip(${skip})`)
    return [
      'Page out of bounds - returning first page',
      {
        nextPageToken: queriedCount <= limit ? '' : 'Page 2',
        totalPages
      },
    ]
  }

  return [
    null,
    {
      nextPageToken: queriedCount <= skip + limit ? '' : `Page ${skip / limit + 2}`,
      totalPages
    }
  ]
}
