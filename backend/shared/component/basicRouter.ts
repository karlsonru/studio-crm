import { Router } from 'express';
import { checkId, injectMiddlewares } from '../middlewares';

// @ts-ignore
export function createBasicRouter(controller, middlewares) {
  const basicRouter = Router();

  const injector = middlewares.injectMiddlewares;

  basicRouter.get('/', controller.getAll);
  basicRouter.get('/:id', injector(middlewares.get), controller.getOne);
  basicRouter.post('/find', controller.find);
  basicRouter.post('/', injector(middlewares.post), controller.create);
  basicRouter.patch('/:id', injector(middlewares.patch), controller.patch);
  basicRouter.delete('/:id', injector(middlewares.delete), controller.delete);

  return basicRouter;
}

// @ts-ignore
export function createBasicRouterWithDefaultMiddlewares(controller, middlewares) {
  const middlewaresWithDefault = {
    injectMiddlewares,

    get:
      middlewares.get ? [checkId, ...middlewares.get] : [checkId],

    post:
      middlewares.post ? middlewares.post : [],

    patch:
      middlewares.patch ? [checkId, ...middlewares.patch] : [checkId],

    delete:
      middlewares.delete ? [checkId, ...middlewares.delete] : [checkId],
  };

  return createBasicRouter(controller, middlewaresWithDefault);
}
