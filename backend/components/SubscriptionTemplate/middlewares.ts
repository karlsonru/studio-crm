import { body } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export function checkCreateSubscriptionTemplate(req: Request, res: Response, next: NextFunction) {
  body('title')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .bail()
    .trim()
    .isLength({ min: 2 })
    .run(req);

  body('duration')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .run(req);

  body('price')
    .exists({
      checkNull: true,
    })
    .run(req);

  body('visits')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .run(req);

  body('duration')
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

  next();
}
