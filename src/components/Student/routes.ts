import { Student } from '../../models';
import { createBasicRouter } from '../../shared/component';
import { StudentController } from './controller';
import { StudentServices } from './services';
import { loggerControllers } from '../../config/logger';
import { errorLogger, errorHandler, injectQuery } from '../../shared';
import { checkCreateStudent } from './middlewares';
import { checkLogin, checkId, injectMiddlewares } from '../../shared/middlewares';

const middlewares = {
  injectMiddlewares,
  get: [checkId],
  post: [checkLogin, checkCreateStudent, injectQuery(['name', 'surname'])],
  patch: [checkId],
  delete: [checkId],
};

const handlers = {
  errorHandler,
  errorLogger,
  loggerControllers,
};

const service = new StudentServices(Student);
const controller = new StudentController(service);

const studentRouter = createBasicRouter(controller, middlewares, handlers);

export default studentRouter;
