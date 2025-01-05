import { status as grpcStatusCode } from '@grpc/grpc-js'


export const ErrorTypes = {
  UNKNOWN: 'unknown',

  HEADER_UNKNOWN: 'header.unknown.failed',
  HEADER_CONTENT_TYPE: 'header.content-type.failed',
  HEADER_ACCEPT: 'header.accept.failed',

  PARAM_REQUIRED: 'param.get.failed',
  PARAM_INVALID: 'param.validate.failed',
  PARAM_PARSE: 'param.parse.failed',

  BODY_INVALID: 'body.validate.failed',
  BODY_PARSE: 'body.parse.failed',

  ENTITY_PARSE: 'entity.parse.failed',

  DB_FIND: 'db.find.failed',
} as const

export type ErrorTypes = (typeof ErrorTypes)[keyof typeof ErrorTypes]

export type ErrorData = {
  message: string
  status?: number
  type?: ErrorTypes
  body?: string
  schema?: string
}

const getGrpcStatus = (code: number) => {
  switch (code) {
    case grpcStatusCode.UNKNOWN:          return 500
    case grpcStatusCode.INVALID_ARGUMENT: return 400
    case grpcStatusCode.NOT_FOUND:        return 404
    default:                              return 500
  }
}

const getGrpcType = (code: number) => {
  switch (code) {
    case grpcStatusCode.UNKNOWN:          return ErrorTypes.UNKNOWN
    case grpcStatusCode.INVALID_ARGUMENT: return ErrorTypes.PARAM_PARSE
    case grpcStatusCode.NOT_FOUND:        return ErrorTypes.DB_FIND
    default:                              return ErrorTypes.UNKNOWN
  }
}

export const createErrorData = (error: unknown) => {
  if (typeof error === 'string')
    return { message: error }

  if (typeof error !== 'object' || error === null)
    return { message: 'Unknown Error' }
  
  if ('details' in error && typeof error.details === 'string' && 'code' in error && typeof error.code === 'number')
    return { 
      message: error.details, 
      status: getGrpcStatus(error.code), 
      type: getGrpcType(error.code), 
    }

  if ('message' in error && typeof error.message === 'string')
    return { message: error.message }

  if ('error' in error && typeof error.error === 'string')
    return { message: error.error }

  return { message: 'Unknown Error' }
}

export class ExtendedError extends Error {
  status?: number = undefined
  type?: ErrorTypes = undefined
  body?: string = undefined
  schema?: string = undefined

  constructor({ message, status, type, body, schema }: {
    message: string
    status?: number
    type?: ErrorTypes
    body?: string
    schema?: string
  }) {
    super(message)

    this.name = 'ExtendedError'
    this.status = status || 500
    this.type = type || ErrorTypes.UNKNOWN
    this.body = body
    this.schema = schema

    Object.setPrototypeOf(this, ExtendedError.prototype)
  }
}

export class NotFoundError extends ExtendedError {
  constructor({ message }: {
    message?: string
  }) {
    super({ 
      message: message ?? 'Not found.', 
      status: 404,  
      type: ErrorTypes.DB_FIND, 
    })

    this.name = 'NotFoundError'

    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

export class BadBodySchemaError extends ExtendedError {
  constructor({ message, body, schema }: {
    message?: string
    body?: string
    schema?: string
  }) {
    super({ 
      message: message ?? 'Bad body given.', 
      status: 400,  
      type: ErrorTypes.BODY_INVALID, 
      body: body, 
      schema: schema, 
    })

    this.name = 'BadBodySchemaError'

    Object.setPrototypeOf(this, BadBodySchemaError.prototype)
  }
}

export class BadParamError extends ExtendedError {
  constructor({ message, schema }: {
    message?: string
    schema?: string
  }) {
    super({ 
      message: message ?? 'Bad param given.', 
      status: 400, 
      type: ErrorTypes.PARAM_INVALID, 
      schema: schema, 
    })

    this.name = 'BadParamError'

    Object.setPrototypeOf(this, BadParamError.prototype)
  }
}

export class MissingParamError extends ExtendedError {
  constructor({ message, schema }: {
    message?: string
    schema?: string
  }) {
    super({ 
      message: message ?? 'Param is required.', 
      status: 400, 
      type: ErrorTypes.PARAM_REQUIRED, 
      schema: schema, 
    })

    this.name = 'MissingParamError'

    Object.setPrototypeOf(this, MissingParamError.prototype)
  }
}

export class BadHeaderError extends ExtendedError {
  constructor({ message, status, type }: {
    message?: string,
    status?: number,
    type?: ErrorTypes,
  }) {
    super({ 
      message: message ?? 'Invalid Header or its value.', 
      status: status ?? 400,
      type: type ?? ErrorTypes.HEADER_UNKNOWN, 
    })

    this.name = 'BadHeaderError'

    Object.setPrototypeOf(this, BadHeaderError.prototype)
  }
}

/**
 * @deprecated
 */
export class BadMediaTypeErrror extends BadHeaderError {
  constructor({ message }: {
    message?: string
  }) {
    super({ 
      message: message ?? 'Unsupported Media Type.', 
      status: 415,  
      type: ErrorTypes.HEADER_CONTENT_TYPE, 
    })

    this.name = 'BadMediaTypeErrror'

    Object.setPrototypeOf(this, BadMediaTypeErrror.prototype)
  }
}

export class BadRequestedMediaTypeError extends BadHeaderError {
  constructor({ message }: {
    message?: string
  }) {
    super({ 
      message: message ?? 'Unsupported Media Type.', 
      status: 406,  
      type: ErrorTypes.HEADER_ACCEPT, 
    })

    this.name = 'BadRequestedMediaTypeError'

    Object.setPrototypeOf(this, BadRequestedMediaTypeError.prototype)
  }
}

export class BadContentMediaTypeError extends BadHeaderError {
  constructor({ message }: {
    message?: string
  }) {
    super({ 
      message: message ?? 'Unsupported Media Type.', 
      status: 415,  
      type: ErrorTypes.HEADER_CONTENT_TYPE, 
    })

    this.name = 'BadContentMediaTypeError'

    Object.setPrototypeOf(this, BadContentMediaTypeError.prototype)
  }
}
