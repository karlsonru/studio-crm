import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { User } from '../models';

export class UserController {
  static async getUsers(req: Request, res: Response) {
    try {
      const users = await User.find({});
      return res.json({ message: users });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  }

  static async getOneUser(req: Request, res: Response) {
    try {
      const user = await User.findOne({ login: req.params.id });
      return res.json({ message: user });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const isNotUnique = await User.findOne({ login: req.params.id });

      console.log(isNotUnique);
      if (isNotUnique) {
        return res.status(400).json({ message: 'Пользователь с таким логином уже существует' });
      }

      // const salt = process.env.SALT ?? 10;
      const passHash = await bcryptjs.hash(req.body.password, 8);
      const newUser = await User.create({
        ...req.body, password: passHash, birthday: new Date(req.body.birthday)
      });

      return res.json({ message: newUser });
    } catch (err) {
      console.log(err)
      return res.status(500).json({ message: err });
    }
  }

  static async patch(req: Request, res: Response) {
    try {
      const updateUser = await User.findOneAndUpdate({ login: req.params.id }, ...req.body, { returnDocument: 'after' });
      return res.json({ message: updateUser });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      // проверяем, если есть какие-то зависимости - то это patch isActive = false;
      // Если зависимостей нет - то можно rempve;
      const removeUser = await User.findOneAndRemove({ login: req.params.id }, ...req.body);
      return res.json({ message: removeUser });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  }
}
