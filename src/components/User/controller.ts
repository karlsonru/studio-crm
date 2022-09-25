import { Request, Response, NextFunction } from 'express';
import { UserServices } from './services';

export class UserController {
  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserServices.getAll();
      return res.json({ message: users });
    } catch (err) {
      next(err);
    }
  }

  static async getOneUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserServices.getOne(req.params.id);

      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' });
      }

      return res.json({ message: user });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const newUser = await UserServices.create(req.body);

      if (newUser === null) {
        return res.status(200).json({ message: 'Пользователь с таким логином уже существует' });
      }

      return res.status(201).json({ message: newUser });
    } catch (err) {
      next(err);
    }
  }

  static async patch(req: Request, res: Response, next: NextFunction) {
    try {
      const updateUser = UserServices.update(req.params.id, req.body);

      if (!updateUser) {
        return res.status(400).json({ message: 'Пользователь не найден' });
      }

      return res.json({ message: updateUser });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      // проверяем, если есть какие-то зависимости - то это patch isActive = false;
      // Если зависимостей нет - то можно rempve;
      const removeUser = await UserServices.delete(req.params.id);

      if (!removeUser) {
        return res.status(400).json({ message: 'Пользователь не найден' });
      }

      return res.status(204);
    } catch (err) {
      next(err);
    }
  }
}
