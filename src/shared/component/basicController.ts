import { Request, Response, NextFunction } from 'express';
import { BasicServices } from './basicServices';

export class BasicController {
  service: BasicServices;

  constructor(basicService: BasicServices) {
    this.service = basicService;
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const results = await this.service.getAll();
      return res.json({ message: results });
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

      return res.json({ message: result });
    } catch (err) {
      next(err);
    }
  };

  find = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.find(req.body.query, +req.params.limit);

      if (!result) {
        return res.status(400).json({ message: 'Не найдено' });
      }

      return res.json({ message: result });
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

      return res.status(201).json({ message: newItem });
    } catch (err) {
      next(err);
    }
  };

  patch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedItem = this.service.update(req.params.id, req.body);

      if (!updatedItem) {
        return res.status(400).json({ message: 'Не найдено' });
      }

      return res.json({ message: updatedItem });
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // проверяем, если есть какие-то зависимости - то это patch isActive = false;
      // Если зависимостей нет - то можно rempve;
      const removedItem = await this.service.delete(req.params.id);

      if (!removedItem) {
        return res.status(400).json({ message: 'Не найдено' });
      }

      return res.status(204);
    } catch (err) {
      next(err);
    }
  };
}
