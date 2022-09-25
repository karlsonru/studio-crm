import { body } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export function checkCreateUser(req: Request, res: Response, next: NextFunction) {
  body('role')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .run(req);

  body('name')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .bail()
    .trim()
    .isLength({ min: 2 })
    .run(req);

  body('surname')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .bail()
    .trim()
    .isLength({ min: 2 })
    .run(req);

  body('isActive')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .run(req);

  next();
}
