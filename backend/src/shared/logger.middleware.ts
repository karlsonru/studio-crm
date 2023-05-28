import { createLogger, format, transports } from 'winston';
const { printf } = format;

const defaultformat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp({
      format: 'DD-MMM-YYYY HH:mm:ss',
    }),
    defaultformat,
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

export { logger };
