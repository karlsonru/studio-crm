import { body } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export function checkCreateStudent(req: Request, res: Response, next: NextFunction) {
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

  body('birthday')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .run(req);

  body('sex')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .run(req);

  body('isActive')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .run(req);

  body('contacts')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .run(req);

  next();
}
