import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RolesGroup } from '../../models';

interface IPayload {
  id: string,
  role: string,
}

export function checkAccess(groupTitie: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers;

      if (!authorization) {
        return res.status(401).json({ message: 'Не аутентифицирован' });
      }

      const token = authorization.split(' ')[1];

      const decoded = jwt.decode(token) as IPayload;

      const group = await RolesGroup.findOne({ title: groupTitie });

      console.log(groupTitie);
      console.log(group);

      if (!group) {
        return res.status(403).json({ message: 'Не авторизован' });
      }

      if (!group.get('roles').includes(decoded.role)) {
        return res.status(403).json({ message: 'Не авторизован' });
      }

      next();
    } catch (err) {
      return res.status(403).json({ message: 'Не авторизован' });
    }
  };
}
