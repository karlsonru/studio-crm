import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secret = process.env.TOKEN_SECRET ?? 'helloWorld';

export function checkToken(req: Request, res: Response, next: NextFunction) {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ message: 'Не аутентифицирован' });
    }

    const token = authorization.split(' ')[1];

    const isValid = jwt.verify(token, secret);

    if (!isValid) {
      return res.status(401).json({ message: 'Не аутентифицирован' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Не аутентифицирован' });
  }
}
