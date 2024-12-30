import { isProd } from "./env"

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

enum logLevels {
  'debug' = 0,
  'info',
  'warn', 
  'error', 
}

const consoleColors: Record<LogLevel | 'default', string> = {
  debug: '\x1b[37m',
  info: '\x1b[34m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  default: '\x1b[90m'
} as const

export abstract class Log {
  public static init = (logLevel?: LogLevel) => {
    if (logLevel)
      this.logLevel = logLevel
    else if (isProd())
      this.logLevel = 'info'
  }

  public static debug = (...message: any[]) => this.log('debug', ...message)
  public static info = (...message: any[]) => this.log('info', ...message)
  public static warn = (...message: any[]) => this.log('warn', ...message)
  public static error = (...message: any[]) => this.log('error', ...message)

  private static logLevel: LogLevel = 'debug'

  private static log = (level: LogLevel, ...message: any[]) => {
    if (logLevels[level] < logLevels[this.logLevel])
      return

    const now = (new Date()).toISOString()
    const logger = (console?.[level] || console.log)
    const color = consoleColors?.[level] || consoleColors.default

    logger(`${color}[${level.toUpperCase()} :: ${now}]\t`, ...message, '\x1b[0m')
  }
}

/**
 * @deprecated
 */
export const _log = (level: LogLevel, ...message: any[]) => {
  const today = (new Date()).toISOString()
  const logger = (console?.[level] || console.log)
  const color = consoleColors?.[level] || '\x1b[90m'

  logger(`${color}[${level.toUpperCase()} :: ${today}]\t`, ...message, '\x1b[0m')
}
