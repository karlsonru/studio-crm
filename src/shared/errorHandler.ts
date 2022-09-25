import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  switch (err.name) {
    case 'MongoServerError':
      res.status(500).json({ message: 'Ошибка записи в базу данных' });
      break;
    case 'ValidationError':
      console.log(err.message);
      return res.status(400).json({ message: err.message || 'Переданы некорректные данные при запросе' });
    default:
      res.status(500).json({ message: 'Необработанная ошибка' });
      next();
  }
}
