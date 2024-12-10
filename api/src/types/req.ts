export type SortOrder = 'asc' | 'desc'


export type ParamUnknown = Record<string, string>

export type ParamNoteName = {
  note: string
}

export type ParamInstrumentName = {
  instrument: string
}

export type ParamTuningName = {
  tuning: string
}

export type ParamScaleName = {
  scale: string
}


export type BodyInstrument = {
  name: string
  defaultTuning?: string
}

export type BodyInstrumentOrMany = 
  | BodyInstrument 
  | BodyInstrument[]


export type QueryUnknown = Record<string, string>

export type QueryFilter = {
  filter_by: string
  filter_for: string
}

export type QuerySorter = {
  sort_by: string
  order: SortOrder
  group_by: string
}

export type QueryPaginator = {
  page: number
  limit: number
}

export type QueryHateoas = {
  hateoas: boolean
}


export type LocalUnknown = Record<string, unknown>
