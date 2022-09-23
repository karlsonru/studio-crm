import { Request, Response } from 'express';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      console.log('Hello');
    } catch (e) {
      console.log('Hello');
    }
    return res.json({ message: 'register' });
  }

  static async login(req: Request, res: Response) {
    try {
      console.log(req);
    } catch (e) {
      console.log('Hello');
    }
    return res.json({ message: 'login' });
  }

  static async logout(req: Request, res: Response) {
    try {
      console.log(req);
    } catch (e) {
      console.log('Hello');
    }
    return res.json({ message: 'logout' });
  }
}
