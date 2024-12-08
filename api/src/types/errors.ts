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
