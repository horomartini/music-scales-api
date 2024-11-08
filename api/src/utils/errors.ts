export const handleError = (func: any) => async (req: any, res: any, next: any) => {
  try {
    await func(req, res, next)
  } catch (error) {
    next(error)
  }
}