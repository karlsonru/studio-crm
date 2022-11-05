import { NextFunction, Request, Response } from 'express';
import log4js from 'log4js';

export function errorLogger(logger: log4js.Logger) {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err);
    next(err);
  };
}
