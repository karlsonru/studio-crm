import { Request, Response, NextFunction } from 'express';
import { BasicController, BasicServices } from '../../shared/component';

export class SubscriptionController extends BasicController<BasicServices> {
  find = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.find(req.body, +req.params.limit);

      if (!result) {
        return res.status(400).json({ message: 'Не найдено' });
      }

      return res.json({ message: 'success', payload: result });
    } catch (err) {
      next(err);
    }
  };
}
