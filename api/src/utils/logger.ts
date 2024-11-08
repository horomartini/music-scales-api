type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const consoleColors = {
  debug: '\x1b[37m',
  info: '\x1b[34m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
}

export const log = (level: LogLevel, ...message: any[]) => {
  const today = (new Date()).toISOString()
  const logger = (console?.[level] || console.log)
  const color = consoleColors?.[level] || '\x1b[90m'

  logger(`${color}[${level.toUpperCase()} :: ${today}]\t`, ...message, '\x1b[0m')
}