const devMode = [undefined, 'dev', 'development']
const prodMode = ['prod', 'production']

export const getEnv = () => process.env.NODE_ENV

export const isDev = () => devMode.includes(getEnv())

export const isProd = () => prodMode.includes(getEnv() ?? '')
