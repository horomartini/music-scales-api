const mode = {
  dev: [undefined, 'dev', 'development'],
  prod: ['prod', 'production'],
}

export const isDev = (nodeEnv: string | undefined) => mode.dev.includes(nodeEnv)

export const isProd = (nodeEnv: string | undefined) => mode.prod.includes(nodeEnv ?? '')
