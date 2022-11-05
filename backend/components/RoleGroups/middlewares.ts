import { body } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export function checkCreateRolesGroup(req: Request, res: Response, next: NextFunction) {
  body('title')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .bail()
    .trim()
    .isLength({ min: 2 })
    .run(req);

  body('roles')
    .exists({
      checkNull: true,
    });

  next();
}
