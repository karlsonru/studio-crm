import { Request, Response, NextFunction } from 'express';
import { LessonServices } from './services';

export class LessonController {
  static async getLessons(req: Request, res: Response, next: NextFunction) {
    try {
      const lessons = await LessonServices.getLessons();
      return res.json({ message: lessons });
    } catch (err) {
      next(err);
    }
  }

  static async getLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const lesson = await LessonServices.getLesson(req.params.id);

      if (!lesson) {
        return res.status(400).json({ message: 'Занятие не найдено' });
      }

      return res.json({ message: lesson });
    } catch (err) {
      next(err);
    }
  }

  static async findLessons(req: Request, res: Response, next: NextFunction) {
    try {
      const lessons = await LessonServices.findLessons(req.body, +req.params.limit);

      if (!lessons) {
        return res.status(400).json({ message: 'Занятий не найдено' });
      }

      return res.json({ message: lessons });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const newLesson = await LessonServices.create(req.body);

      if (newLesson === null) {
        return res.status(200).json({ message: 'В это время у этого преподавателя уже есть занятие' });
      }

      return res.status(201).json({ message: newLesson });
    } catch (err) {
      next(err);
    }
  }

  static async patch(req: Request, res: Response, next: NextFunction) {
    try {
      const updateLesson = LessonServices.update(req.params.id, req.body);

      if (!updateLesson) {
        return res.status(400).json({ message: 'Занятие не найдено' });
      }

      return res.json({ message: updateLesson });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      // проверяем, если есть какие-то зависимости - то это patch isActive = false;
      // Если зависимостей нет - то можно rempve;
      const removeLesson = await LessonServices.delete(req.params.id);

      if (!removeLesson) {
        return res.status(400).json({ message: 'Занятие не найдено' });
      }

      return res.status(204);
    } catch (err) {
      next(err);
    }
  }
}
