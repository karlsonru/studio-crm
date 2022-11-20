import { Request, Response, NextFunction } from 'express';
import { BasicController } from '../../shared/component';
import { LessonServices } from './services';

export class LessonController extends BasicController {
  service: LessonServices;

  constructor(service: LessonServices) {
    super(service);
    this.service = service;
  }

  findByDay = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findByDay(req.body.query, +req.params.limit);

      if (!result.length) {
        return res.status(400).json({ message: 'Не найдено' });
      }

      return res.json({ message: 'success', payload: result });
    } catch (err) {
      next(err);
    }
  };
}
