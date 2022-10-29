import { VisitedLesson } from '../../models';
import { createBasicRouter } from '../../shared/component';
import { VisitStatusController } from './controller';
import { VisitStatusServices } from './services';
import { loggerControllers } from '../../config/logger';
import { errorLogger, errorHandler, injectQuery } from '../../shared';
import { checkCreateVisitStatus } from './middlewares';
import { checkLogin, checkId, injectMiddlewares } from '../../shared/middlewares';

const middlewares = {
  injectMiddlewares,
  get: [checkId],
  post: [checkLogin, checkCreateVisitStatus, injectQuery(['title'])],
  patch: [checkId],
  delete: [checkId],
};

const handlers = {
  errorHandler,
  errorLogger,
  loggerControllers,
};

const service = new VisitStatusServices(VisitedLesson);
const controller = new VisitStatusController(service);

const visitedLessonRouter = createBasicRouter(controller, middlewares, handlers);

export default visitedLessonRouter;
