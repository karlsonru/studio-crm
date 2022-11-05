import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ValidationError } from '../validationError';

const checkErrors = (req: Request, res: Response, next: NextFunction) => {
  console.log(validationResult(req));
  console.log(validationResult(req).isEmpty());
  if (validationResult(req).isEmpty()) {
    next();
  } else {
    throw new ValidationError();
  }
};

// @ts-ignore
export function injectMiddlewares(middlewares) {
  return [
    ...middlewares,
    checkErrors,
  ];
}
