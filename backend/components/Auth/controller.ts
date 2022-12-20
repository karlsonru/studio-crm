import { NextFunction, Request, Response } from 'express';
import { AuthServices } from './services';
import { ValidationError } from '../../shared';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { login, password } = req.body;

      const token = await AuthServices.login(login, password);

      if (!token) {
        throw new ValidationError('Неправильный логин или пароль');
      }

      return res.json({ token });
    } catch (err) {
      next(err);
    }
  }
}
