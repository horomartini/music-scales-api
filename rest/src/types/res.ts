export type ResponseBody<T> = T | {
  success: boolean
  data: T
}