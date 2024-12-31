const devMode = [undefined, 'dev', 'development']
const prodMode = ['prod', 'production']

export const getEnv = () => process.env.NODE_ENV

export const isDev = () => devMode.includes(getEnv())

export const isProd = () => prodMode.includes(getEnv() ?? '')

export const hasMongo = () => Boolean(process.env.MONGO_URI)

export const useProto = () => Boolean(process.env.USE_PROTO)
