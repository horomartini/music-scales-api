export const parameters = {
  noteId: createDefaultIdParam({ description: 'Note ID field.' }),
  instrumentId: createDefaultIdParam({ description: 'Instrument ID field.' }),
  tuningId: createDefaultIdParam({ description: 'Tuning ID field.' }),
  scaleId: createDefaultIdParam({ description: 'Scale ID field.' }),

  filter: {
    ...createDefaultFilterQueryParamObject({ name: 'name' })
  },

  sort: {
    name: createDefaultSortQueryParam({
      name: 'name',
      description: 'Sort by "name" field.',
    })
  },

  paginate: {
    page: createDefaultQueryParam({
      name: 'page',
      description: 'Selects specified page after pagination. Page token out of bounds defaults to first available page.',
      schema: { type: 'number' },
    }),
    limit: createDefaultQueryParam({
      name: 'limit',
      description: 'Specify maximum entries per page. Negative values default to 0.',
      schema: { type: 'number' },
    }),
  },

  noData: createDefaultQueryParam({
    name: 'no_data',
    description: 'Specify no data to be returned - 204 on success.',
    schema: { type: 'boolean' },
  }),
}

export const requests = {
  noteBody: {
    description: 'Note schema without ID.',
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
          },
          required: [
            'name',
          ],
        },
      },
    },
  },
  optionalNoteBody: {
    description: 'Note schema without ID.',
    required: false,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
          },
        },
      },
    },
  },

  instrumentBody: {
    description: 'Instrument schema without ID.',
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            defaultTuning: { type: 'string' },
          },
          required: [
            'name',
          ],
        },
      },
    },
  },
  optionalInstrumentBody: {
    description: 'Instrument schema without ID.',
    required: false,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            defaultTuningId: { type: 'string' },
          },
        },
      },
    },
  },

  tuningBody: {
    description: 'Tuning schema without ID.',
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            instrumentId: { type: 'string' },
            notes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  noteId: { type: 'string' },
                  octave: { type: 'number' },
                },
              },
            },
          },
          required: [
            'name',
          ],
        },
      },
    },
  },
  optionalTuningBody: {
    description: 'Tuning schema without ID.',
    required: false,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            instrumentId: { type: 'string' },
            notes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  noteId: { type: 'string' },
                  octave: { type: 'number' },
                },
              },
            },
          },
        },
      },
    },
  },

  scaleBody: {
    description: 'Scale schema without ID.',
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            steps: {
              type: 'array', 
              minItems: 1,
              items: {
                type: 'number',
              },
            },
          },
          required: [
            'name',
            'steps',
          ],
        },
      },
    },
  },
  optionalScaleBody: {
    description: 'Scale schema without ID.',
    required: false,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            steps: {
              type: 'array', 
              minItems: 1,
              items: {
                type: 'number',
              },
            },
          },
        },
      },
    },
  },
}

export const responses = {
  noteData: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
    },
    required: [
      'id',
      'name',
    ],
  },
  instrumentData: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      defaultTuning: { type: 'string' },
    },
    required: [
      'id',
      'name',
    ],
  },
  tuningData: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      instrumentId: { type: 'string' },
      notes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            noteId: { type: 'string' },
            octave: { type: 'number' },
          },
        },
      },
    },
    required: [
      'id',
      'name',
    ],
  },
  scaleData: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      steps: {
        type: 'array', 
        minItems: 1,
        items: {
          type: 'number',
        },
      },
    },
    required: [
      'id',
      'name',
      'steps',
    ],
  },

  paginationData: {
    type: 'object',
    properties: {
      totalCount: { type: 'number' },
      pagesCount: { type: 'number' },
      nextPage: { type: 'number' },
    },
    required: [
      'totalCount',
      'pagesCount',
      'nextPage',
    ],
  },

  badRequest: {
    description: 'An error was encountered.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              default: 'false',
            },
            error: { type: 'string' },
            details: {
              type: 'object',
              properties: {
                errorName: { type: 'string' },
                errorType: { type: 'string' },
                receivedBody: { type: 'string' },
                expectedSchema: { type: 'string' },
              },
            },
          },
          required: [
            'success',
            'error',
          ],
        },
      },
    },
  },

  noteNotFound: createNotFoundResponse({
    description: 'Note with given ID was not found.'
  }),
  instrumentNotFound: createNotFoundResponse({
    description: 'Instrument with given ID was not found.'
  }),
  tuningNotFound: createNotFoundResponse({
    description: 'Tuning with given ID was not found.'
  }),
  scaleNotFound: createNotFoundResponse({
    description: 'Scale with given ID was not found.'
  }),

  noData: {
    description: 'Success, but no data is returned. Triggered with "?no_data=true".',
  }
}


function createDefaultIdParam(fields: Record<string, unknown>) {
  return ({
    name: 'id',
    in: 'path',
    description: 'ID field.',
    required: true,
    schema: { type: 'string' },
    ...fields,
  })
}

function createDefaultQueryParam(fields: Record<string, unknown>) {
  return ({
    name: 'undefined',
    in: 'query',
    description: 'Undefined query parameter.',
    required: false,
    schema: { type: 'string' },
    ...fields,
  })
}

function createDefaultFilterQueryParamObject(fields: Record<string, unknown>) {
  const stringOps = {
    _ne: '!=',
    _eq: '=',
  } as const

  const numberOps = {
    _le: '<=',
    _lt: '<',
    _ge: '>=',
    _gt: '>',
    _ne: '!=',
    _eq: '=',
  } as const

  const booleanOps = {
    _ne: '!=',
    _eq: '=',
  }

  const opMap = (acc: Record<string, object>, [opName, opVal]: [string, string]) => {
    const name = fields?.name || 'undefined'
    const name_op = `${name}${opName}`

    const obj = createDefaultQueryParam({
      ...fields,
      name: name_op,
      description: `Filter for "${opVal}" operation in "${name}" against specified value. \`obj[${name}] ${opVal} {value}\`.`,
    })

    return { ...acc, [name_op]: obj }
  }

  let ops: Record<string, string> = stringOps

  if ('schema' in fields && 'type' in (fields.schema as Record<string, string>)) {
    if (((fields.schema as Record<string, string>).type as string) == 'number')
      ops = numberOps
    else if (((fields.schema as Record<string, string>).type as string) == 'boolean')
      ops = booleanOps
  }

  return Object.entries(ops).reduce(opMap, {})
}

function createDefaultSortQueryParam(fields: Record<string, unknown>) {
  return ({
    name: 'undefined',
    in: 'query',
    description: 'Undefined sorting query parameter.',
    required: false,
    schema: { 
      type: 'string',
      enum: ['asc', 'desc'],
    },
    example: 'asc',
    ...fields,
  })
}

function createNotFoundResponse(fields: Record<string, unknown>) {
  return ({
    description: 'Document with given ID was not found.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              default: 'false',
            },
            error: { type: 'string' },
          },
          required: [
            'success',
            'error',
          ],
        },
      },
    },
    ...fields,
  })
}
