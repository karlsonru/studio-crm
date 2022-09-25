import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthServices } from './services';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      validationResult(req).throw();

      const { login, password } = req.body;

      const token = AuthServices.login(login, password);

      if (!token) {
        return res.status(400).json({ message: 'Неправильный логин или пароль' });
      }

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
