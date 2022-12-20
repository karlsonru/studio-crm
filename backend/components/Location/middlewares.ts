import { body } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export function checkCreateLocation(req: Request, res: Response, next: NextFunction) {
  body('title')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .bail()
    .trim()
    .isLength({ min: 2 })
    .run(req);

  body('address')
    .exists({
      checkNull: true,
    })
    .run(req);

  next();
}
