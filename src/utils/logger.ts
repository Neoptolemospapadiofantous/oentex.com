// src/utils/logger.ts
type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface Logger {
  info: (message: string, ...args: any[]) => void
  warn: (message: string, ...args: any[]) => void
  error: (message: string, ...args: any[]) => void
  debug: (message: string, ...args: any[]) => void
}

class DevLogger implements Logger {
  private log(level: LogLevel, message: string, ...args: any[]) {
    const emoji = {
      info: '🔍',
      warn: '⚠️',
      error: '❌',
      debug: '🐛'
    }[level]
    
    console[level](`${emoji} [${new Date().toISOString()}] ${message}`, ...args)
  }

  info(message: string, ...args: any[]) {
    this.log('info', message, ...args)
  }

  warn(message: string, ...args: any[]) {
    this.log('warn', message, ...args)
  }

  error(message: string, ...args: any[]) {
    this.log('error', message, ...args)
  }

  debug(message: string, ...args: any[]) {
    this.log('debug', message, ...args)
  }
}

class ProdLogger implements Logger {
  info() {}
  warn() {}
  error(message: string, ...args: any[]) {
    // Only log errors in production, potentially to external service
    console.error(message, ...args)
  }
  debug() {}
}

export const logger: Logger = import.meta.env.MODE === 'development' 
  ? new DevLogger() 
  : new ProdLogger()