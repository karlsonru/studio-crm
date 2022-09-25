import { body } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export async function checkLogin(req: Request, res: Response, next: NextFunction) {
  await body('login')
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
