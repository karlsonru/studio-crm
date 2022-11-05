import { body } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export function checkCreateRole(req: Request, res: Response, next: NextFunction) {
  body('value')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .bail()
    .trim()
    .isLength({ min: 2 })
    .run(req);

  next();
}
