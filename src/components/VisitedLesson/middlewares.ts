import { body } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export function checkCreateVisitStatus(req: Request, res: Response, next: NextFunction) {
  body('lesson')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .run(req);

  body('day')
    .exists({
      checkNull: true,
    })
    .run(req);

  body('date')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .run(req);

  body('students')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .run(req);

  next();
}
