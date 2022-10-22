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

// @ts-ignore
export function validationMiddleware(middlewares) {
  return [
    ...middlewares,
    checkErrors,
  ];
}
