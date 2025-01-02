import type { LogLevel } from './types'

import { logLevels } from './types'


const consoleColors: Record<LogLevel | 'default', string> = {
  debug: '\x1b[37m',
  info: '\x1b[34m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  default: '\x1b[90m',
} as const

export abstract class Log {
  public static init = (isProd?: () => boolean, logLevel: LogLevel = 'debug') => {
    if (isProd && isProd())
      this.logLevel = 'info'
    else
      this.logLevel = logLevel
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
