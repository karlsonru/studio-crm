import { Router } from 'express';
import { LessonController } from './controller';
import { checkCreateLesson } from './middlewares';
import { loggerControllers } from '../../config/logger';
import {
  errorLogger,
  errorHandler,
  checkLogin,
  checkId,
  validationMiddleware,
} from '../../shared';

const lessonRouter = Router();

lessonRouter.get('/', LessonController.getLessons);
lessonRouter.get('/:id', validationMiddleware([checkId]), LessonController.getLesson);
lessonRouter.post('/', validationMiddleware([checkLogin, checkCreateLesson]), LessonController.create);
lessonRouter.patch('/:id', validationMiddleware([checkId]), LessonController.patch);
lessonRouter.delete('/:id', validationMiddleware([checkId]), LessonController.delete);

lessonRouter.use(errorLogger(loggerControllers));
lessonRouter.use(errorHandler);

export default lessonRouter;
