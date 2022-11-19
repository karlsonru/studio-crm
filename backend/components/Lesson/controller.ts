import { Request, Response, NextFunction } from 'express';
import { BasicController } from '../../shared/component';

export class LessonController extends BasicController {
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
