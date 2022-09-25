import { body } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export async function checkCreateUser(req: Request, res: Response, next: NextFunction) {
  await body('role')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .run(req);

  await body('name')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .bail()
    .trim()
    .isLength({ min: 2 })
    .run(req);

  await body('surname')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .bail()
    .trim()
    .isLength({ min: 2 })
    .run(req);

  await body('isActive')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .run(req);

  next();
}
