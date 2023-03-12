import { Request, Response, NextFunction } from 'express';
import { BasicServices } from './basicServices';

export class BasicController<T extends BasicServices> {
  service: T;

  constructor(basicService: T) {
    this.service = basicService;
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const results = await this.service.getAll();
      return res.json({ payload: results });
    } catch (err) {
      next(err);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getOne(req.params.id);

      if (!result) {
        return res.status(400).json({ message: 'Не найдено' });
      }

      return res.json({ message: 'success', payload: result });
    } catch (err) {
      next(err);
    }
  };

  find = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = JSON.parse(req.query.findQuery as string);
      const result = await this.service.find(params);

      if (!result) {
        return res.status(400).json({ message: 'Не найдено' });
      }

      return res.json({ message: 'success', payload: result });
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newItem = await this.service.create(req.body, req.body.query);

      if (newItem === null) {
        return res.status(200).json({ message: 'Уже существует' });
      }

      return res.status(201).json({ message: 'success', payload: newItem });
    } catch (err) {
      next(err);
    }
  };

  patch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedItem = await this.service.update(req.params.id, req.body);

      if (!updatedItem) {
        return res.status(400).json({ message: 'Не найдено' });
      }

      return res.json({ message: 'success', payload: updatedItem });
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const removedItem = await this.service.delete(req.params.id);

      if (!removedItem) {
        return res.status(400).json({ message: 'Не найдено' });
      }

      return res.status(204).end();
    } catch (err) {
      next(err);
    }
  };
}
