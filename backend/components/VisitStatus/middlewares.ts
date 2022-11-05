import { body } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export function checkCreateVisitStatus(req: Request, res: Response, next: NextFunction) {
  body('title')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .run(req);

  body('action')
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
