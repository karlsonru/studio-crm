import { Request, Response, NextFunction } from 'express';
import { param } from 'express-validator';

export function checkId(req: Request, res: Response, next: NextFunction) {
  param('id')
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
