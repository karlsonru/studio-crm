import { Request, Response, NextFunction } from 'express';
import bcryptjs from 'bcryptjs';
import { Role, User } from '../models';

export class UserController {
  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.find({});
      return res.json({ message: users });
    } catch (err) {
      next(err);
    }
    return null;
  }

  static async getOneUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findOne({ login: req.params.id });

      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' });
      }

      return res.json({ message: user });
    } catch (err) {
      next(err);
    }
    return null;
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userExists = await User.findOne({ login: req.body.login });

      if (userExists) {
        return res.status(400).json({ message: 'Пользователь с таким логином уже существует' });
      }

      const role = await Role.findOne({ value: req.body.role });
      const passHash = await bcryptjs.hash(req.body.password, 8);

      const newUser = await User.create({
        ...req.body,
        password: passHash,
        birthday: +req.body.birthday,
        role: role?.value,
      });

      return res.status(201).json({ message: newUser });
    } catch (err) {
      next(err);
    }
    return null;
  }

  static async patch(req: Request, res: Response, next: NextFunction) {
    try {
      const updateUser = await User.findOneAndUpdate({ login: req.params.id }, req.body, { returnDocument: 'after' });

      if (!updateUser) {
        return res.status(400).json({ message: 'Пользователь не найден' });
      }

      return res.json({ message: updateUser });
    } catch (err) {
      next(err);
    }
    return null;
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      // проверяем, если есть какие-то зависимости - то это patch isActive = false;
      // Если зависимостей нет - то можно rempve;
      const removeUser = await User.findOneAndDelete({ login: req.params.id });

      if (!removeUser) {
        return res.status(400).json({ message: 'Пользователь не найден' });
      }

      return res.status(204);
    } catch (err) {
      next(err);
    }
    return null;
  }
}
