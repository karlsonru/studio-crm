import { NextFunction, Request, Response } from 'express';
import log4js from 'log4js';

export function errorLogger(logger: log4js.Logger) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (err: Error, req : Request, res: Response, next: NextFunction) => {
    logger.error(err);
    return res.status(500).json({ message: 'Unhandled error' });
  };
}
