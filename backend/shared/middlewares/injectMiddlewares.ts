import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ValidationError } from '../validationError';

const checkErrors = (req: Request, res: Response, next: NextFunction) => {
  if (validationResult(req).isEmpty()) {
    next();
  } else {
    throw new ValidationError();
  }
};

interface IMiddleware {
  (req: Request, res: Response, next: NextFunction): void;
}

export function injectMiddlewares(middlewares: IMiddleware[]) {
  return [
    ...middlewares,
    checkErrors,
  ];
}
