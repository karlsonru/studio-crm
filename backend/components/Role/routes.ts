import { Role } from '../../models';
import { createBasicRouterWithDefaultMiddlewares } from '../../shared/component';
import { RoleController } from './controller';
import { RoleServices } from './services';
import { checkCreateRole } from './middlewares';
import { injectQuery } from '../../shared/middlewares';

const middlewares = {
  post: [checkCreateRole, injectQuery(['value'])],
};

const service = new RoleServices(Role);
const controller = new RoleController(service);

const roleRouter = createBasicRouterWithDefaultMiddlewares(controller, middlewares);

export default roleRouter;
