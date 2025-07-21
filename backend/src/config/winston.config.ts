import * as winston from 'winston';

// Utility function to get the current function name from the stack
function getFunctionName(): string {
  const stack = new Error().stack;
  if (!stack) return 'unknown';

  const stackLines = stack.split('\n');

  // Skip unnecessary frames to get to the correct function name
  if (stackLines.length > 3) {
    const functionLine = stackLines[3].trim(); // Get the 4th line in the stack trace
    const functionName = functionLine.match(/at (\S+)/); // Extract function name
    return functionName ? functionName[1] : 'anonymous';
  }

  return 'unknown';
}

// Create a logger wrapper that captures the function name before passing the message to Winston
export const logger = {
  info: (message: string) => {
    const functionName = getFunctionName(); // Capture function name before logging
    winstonLogger.info('=== ' + message, { functionName });
  },
  debug: (message: string, metadata?: any) => {
    const debugLogsActive = process.env.DEBUG_LOGS_ACTIVE?.toLowerCase() === 'true';
    const functionName = getFunctionName(); // Capture function name before logging
    if (debugLogsActive) {
      const logMessage = metadata ? `=== ${message} ${JSON.stringify(metadata)}` : `=== ${message}`;
      winstonLogger.info(logMessage, { functionName });
    }
  },
  warn: (message: string) => {
    const functionName = getFunctionName(); // Capture function name before logging
    winstonLogger.info('=== ' + message, { functionName });
  },
  section: (message: string) => {
    const functionName = getFunctionName(); // Capture function name before logging
    winstonLogger.info('='.repeat(80), { functionName });
    winstonLogger.info('='.repeat(30) + ' ' + message + ' ' + '='.repeat(30));
    winstonLogger.info('='.repeat(80) + '\n', { functionName });
  },
  error: (error: Error | string, message?: string) => {
    const functionName = getFunctionName(); // Capture function name before logging

    // If error is an instance of Error, use its message and stack; otherwise, treat it as a string
    let errorDetails;
    if (error instanceof Error) {
      errorDetails = {
        message: error.message,
        name: error.name,
        stack: error.stack,
      };
    } else {
      errorDetails = {
        message: error,
        // @ts-ignore
        name: error?.name || 'unknown',
      };
    }

    // Ensure that a final message is always present (either custom message or error.message)
    const finalMessage = message || errorDetails.message || 'An error occurred';

    // Log the error with structured information
    winstonLogger.error('=== ' + finalMessage, {
      functionName,
      error: errorDetails,
    });
  },
};

// Actual Winston logger configuration
const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, functionName }) => {
      return `${timestamp} [${level}] [${functionName || 'anonymous'}]: ${message}`;
    }),
  ),
  transports: [new winston.transports.Console()],
});
