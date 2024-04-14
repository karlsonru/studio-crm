import { createLogger, format, transports } from 'winston';
const { printf } = format;
import 'dotenv/config';

const defaultformat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  level: process.env['LOG_LEVEL'],
  format: format.combine(
    format.timestamp({
      format: 'DD-MMM-YYYY HH:mm:ss',
    }),
    defaultformat,
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: process.env['LOG_ERROR_PATH'], level: 'error' }),
    new transports.File({ filename: process.env['LOG_COMBINED_PATH'] }),
  ],
});

export { logger };
