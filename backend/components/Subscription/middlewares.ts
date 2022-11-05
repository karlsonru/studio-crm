import { body } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export function checkCreateSubscription(req: Request, res: Response, next: NextFunction) {
  body('template')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .run(req);

  body('student')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .run(req);

  body('dateFrom')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .run(req);

  body('dateTo')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .run(req);

  body('paymentMethod')
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
