export class ExtendedError extends Error {
  status?: number = undefined
  type?: string = undefined
  body?: string = undefined
  schema?: string = undefined

  constructor({ message, status, type, body, schema }: {
    message: string
    status?: number
    type?: string
    body?: string
    schema?: string
  }) {
    super(message)

    this.name = 'ExtendedError'
    this.status = status
    this.type = type
    this.body = body
    this.schema = schema

    Object.setPrototypeOf(this, ExtendedError.prototype)
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
      type: 'body.schema.failed', 
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
      type: 'param.schema.failed', 
      schema: schema
    })

    this.name = 'BadParamError'

    Object.setPrototypeOf(this, BadParamError.prototype)
  }
}

export class BadHeaderError extends ExtendedError {
  constructor({ message, status, type }: {
    message?: string,
    status?: number,
    type?: string,
  }) {
    super({ 
      message: message ?? 'Invalid Header or its value.', 
      status: status ?? 400,
      type: type ?? 'header.any.failed', 
    })

    this.name = 'BadHeaderError'

    Object.setPrototypeOf(this, BadHeaderError.prototype)
  }
}

export class BadMediaTypeErrror extends BadHeaderError {
  constructor({ message }: {
    message?: string
  }) {
    super({ 
      message: message ?? 'Unsupported Media Type.', 
      status: 415,  
      type: 'header.content-type.failed', 
    })

    this.name = 'BadMediaTypeErrror'

    Object.setPrototypeOf(this, BadMediaTypeErrror.prototype)
  }
}

/**
 * @deprecated
 */
export class ResponseError extends Error {
  code: number = 0
  expected: string | undefined = undefined

  constructor(code: number, message: string, expected?: string) {
    super(message)

    this.name = 'ResponseError'
    this.code = code
    this.expected = expected

    Object.setPrototypeOf(this, ResponseError.prototype)
  }
}

/**
 * @deprecated
 */
export const handleError = (func: any) => async (req: any, res: any, next: any) => {
  try {
    await func(req, res, next)
  } catch (error) {
    next(error)
  }
}