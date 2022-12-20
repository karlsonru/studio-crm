import { RolesGroup } from '../../models';
import { createBasicRouterWithDefaultMiddlewares } from '../../shared/component';
import { RolesGroupController } from './controller';
import { RolesGroupServices } from './services';
import { checkCreateRolesGroup } from './middlewares';
import { injectQuery } from '../../shared/middlewares';

const middlewares = {
  post: [checkCreateRolesGroup, injectQuery(['title'])],
};

const service = new RolesGroupServices(RolesGroup);
const controller = new RolesGroupController(service);

const rolesGroupRouter = createBasicRouterWithDefaultMiddlewares(controller, middlewares);

export default rolesGroupRouter;
