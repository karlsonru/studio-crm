import { NextFunction, Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { validationResult } from 'express-validator';
import { User } from '../models';
import { generateAccessToken } from '../middleware';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      // обработать ошибку ?
      validationResult(req).throw();

      const { login, password } = req.body;

      const user = await User.findOne({ login });

      if (!user) {
        return res.status(400).json({ message: 'Такого пользователя не существут' });
      }

      const isValid = bcryptjs.compareSync(password, user.password);

      if (!isValid) {
        return res.status(400).json({ message: 'Неверный пароль' });
      }

      const token = generateAccessToken(user.id, user.role);

      return res.json({ token });
    } catch (err) {
      next(err);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req);
    } catch (err) {
      next(err);
    }
  }
}
