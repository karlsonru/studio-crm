import { Lesson } from '../../models';
import { createBasicRouter } from '../../shared/component';
import { LessonController } from './controller';
import { LessonServices } from './services';
import { loggerControllers } from '../../config/logger';
import { checkCreateLesson } from './middlewares';
import { errorLogger, errorHandler } from '../../shared';
import { checkLogin, checkId, injectMiddlewares } from '../../shared/middlewares';

const middlewares = {
  injectMiddlewares,
  get: [checkId],
  post: [checkLogin, checkCreateLesson],
  patch: [checkId],
  delete: [checkId],
};

const handlers = {
  errorHandler,
  errorLogger,
  loggerControllers,
};

const service = new LessonServices(Lesson);
const controller = new LessonController(service);

const lessonRouter = createBasicRouter(controller, middlewares, handlers);

export default lessonRouter;
