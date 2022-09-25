import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Group } from '../models';

interface IPayload {
  id: string,
  role: string,
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
