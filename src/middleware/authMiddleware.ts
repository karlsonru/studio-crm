import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Group } from '../models';

const secret = process.env.TOKEN_SECRET ?? 'helloWorld';

interface IPayload {
  id: string,
  role: string,
}

export function generateAccessToken(id: string, role: string) {
  const payload: IPayload = {
    id,
    role,
  };
  return jwt.sign(payload, secret, { expiresIn: '24h' });
}

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

export function checkAccess(accessGroup: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers;

      if (!authorization) {
        return res.status(401).json({ message: 'Не аутентифицирован' });
      }

      const token = authorization.split(' ')[1];

      const decoded = jwt.decode(token) as IPayload;

      const group = await Group.findOne({ title: accessGroup });

      if (!group) {
        return res.status(403).json({ message: 'Не авторизован' });
      }

      if (!group.get('members').includes(decoded.role)) {
        return res.status(403).json({ message: 'Не авторизован' });
      }

      next();
    } catch (err) {
      return res.status(403).json({ message: 'Не авторизован' });
    }
  };
}
