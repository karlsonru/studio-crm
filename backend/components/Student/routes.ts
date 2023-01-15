import { Student } from '../../models';
import { createBasicRouterWithDefaultMiddlewares } from '../../shared/component';
import { StudentController } from './controller';
import { StudentServices } from './services';
import { checkCreateStudent } from './middlewares';
import { injectQuery } from '../../shared/middlewares';

const middlewares = {
  post: [checkCreateStudent, injectQuery(['fullname'])],
};

const service = new StudentServices(Student);
const controller = new StudentController(service);

const studentRouter = createBasicRouterWithDefaultMiddlewares(controller, middlewares);

export default studentRouter;
