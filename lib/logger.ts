/**
 * Logging utility for SSI Automations
 *
 * Provides structured logging with different log levels:
 * - DEBUG: Detailed information for debugging
 * - INFO: General informational messages
 * - WARN: Warning messages
 * - ERROR: Error messages with stack traces
 *
 * Usage:
 * import { logger } from '@/lib/logger';
 * logger.info('Newsletter', 'User subscribed', { email: 'user@example.com' });
 */

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";
  private logLevel: LogLevel;

  constructor() {
    // Set log level based on environment
    const envLogLevel = process.env.LOG_LEVEL?.toUpperCase() as LogLevel;
    this.logLevel = envLogLevel || (this.isDevelopment ? "DEBUG" : "INFO");
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ["DEBUG", "INFO", "WARN", "ERROR"];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }

  private formatMessage(
    level: LogLevel,
    category: string,
    message: string,
    context?: LogContext,
  ): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level}] [${category}]`;

    if (context && Object.keys(context).length > 0) {
      return `${prefix} ${message} ${JSON.stringify(context, null, 2)}`;
    }

    return `${prefix} ${message}`;
  }

  private log(
    level: LogLevel,
    category: string,
    message: string,
    context?: LogContext,
  ): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(
      level,
      category,
      message,
      context,
    );

    switch (level) {
      case "DEBUG":
        console.debug(formattedMessage);
        break;
      case "INFO":
        console.info(formattedMessage);
        break;
      case "WARN":
        console.warn(formattedMessage);
        break;
      case "ERROR":
        console.error(formattedMessage);
        break;
    }
  }

  /**
   * Log debug information (only in development or when LOG_LEVEL=DEBUG)
   */
  debug(category: string, message: string, context?: LogContext): void {
    this.log("DEBUG", category, message, context);
  }

  /**
   * Log informational messages
   */
  info(category: string, message: string, context?: LogContext): void {
    this.log("INFO", category, message, context);
  }

  /**
   * Log warning messages
   */
  warn(category: string, message: string, context?: LogContext): void {
    this.log("WARN", category, message, context);
  }

  /**
   * Log error messages with optional error object
   */
  error(
    category: string,
    message: string,
    error?: Error | unknown,
    context?: LogContext,
  ): void {
    const errorContext: LogContext = { ...context };

    if (error instanceof Error) {
      errorContext.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    } else if (error) {
      errorContext.error = error;
    }

    this.log("ERROR", category, message, errorContext);
  }

  /**
   * Create a scoped logger for a specific category
   */
  scope(category: string) {
    return {
      debug: (message: string, context?: LogContext) =>
        this.debug(category, message, context),
      info: (message: string, context?: LogContext) =>
        this.info(category, message, context),
      warn: (message: string, context?: LogContext) =>
        this.warn(category, message, context),
      error: (message: string, error?: Error | unknown, context?: LogContext) =>
        this.error(category, message, error, context),
    };
  }
}

// Export singleton instance
export const logger = new Logger();

// Export type for use in other files
export type { LogContext };
