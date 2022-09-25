import { body } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export function checkLogin(req: Request, res: Response, next: NextFunction) {
  body('login')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .bail()
    .trim()
    .isLength({ min: 5 })
    .run(req);

  body('password')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .bail()
    .trim()
    .isLength({ min: 5 })
    .run(req);

  next();
}
