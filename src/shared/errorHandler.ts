import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  switch (err.name) {
    case 'CastError':
      return res.status(400).json({ message: 'Передан невалидный ID при запросе' });
    case 'MongoServerError':
      return res.status(500).json({ message: 'Ошибка записи в базу данных' });
    case 'ValidationError':
      return res.status(400).json({ message: err.message || 'Переданы некорректные данные при запросе' });
    default:
      console.log(err);
      console.log(err.message);
      res.status(500).json({ message: 'Необработанная ошибка' });
      next();
  }
}
