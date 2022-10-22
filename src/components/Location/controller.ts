import { Request, Response, NextFunction } from 'express';
import { LocationServices } from './services';

export class LocationController {
  static async getLocations(req: Request, res: Response, next: NextFunction) {
    try {
      const locations = await LocationServices.getLocations();
      return res.json({ message: locations });
    } catch (err) {
      next(err);
    }
  }

  static async getLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const location = await LocationServices.getLocation(req.params.id);

      if (!location) {
        return res.status(400).json({ message: 'Место не найдено' });
      }

      return res.json({ message: location });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const newLocation = await LocationServices.create(req.body);

      if (newLocation === null) {
        return res.status(200).json({ message: 'Место с таким именем или адресом уже существует' });
      }

      return res.status(201).json({ message: newLocation });
    } catch (err) {
      next(err);
    }
  }

  static async patch(req: Request, res: Response, next: NextFunction) {
    try {
      const updateLocation = LocationServices.update(req.params.id, req.body);

      if (!updateLocation) {
        return res.status(400).json({ message: 'Место не найдено' });
      }

      return res.json({ message: updateLocation });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      // проверяем, если есть какие-то зависимости - то это patch isActive = false;
      // Если зависимостей нет - то можно rempve;
      const removeLocation = await LocationServices.delete(req.params.id);

      if (!removeLocation) {
        return res.status(400).json({ message: 'Место не найдено' });
      }

      return res.status(204);
    } catch (err) {
      next(err);
    }
  }
}
