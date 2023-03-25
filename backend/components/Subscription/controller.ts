import { Request, Response, NextFunction } from 'express';
import { BasicController, BasicServices } from '../../shared/component';

export class SubscriptionController extends BasicController<BasicServices> {
  find = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const params = JSON.parse(req.query.findQuery);
      const result = await this.service.find(params);

      if (!result) {
        return res.status(400).json({ message: 'Не найдено' });
      }

      return res.json({ message: 'success', payload: result });
    } catch (err) {
      next(err);
    }
  };
}
