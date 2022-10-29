import { Router } from 'express';

// @ts-ignore
export function createBasicRouter(controller, middlewares, handlers) {
  const basicRouter = Router();

  const injector = middlewares.injectMiddlewares;

  basicRouter.get('/', controller.getAll);
  basicRouter.get('/:id', injector(middlewares.get), controller.getOne);
  basicRouter.post('/find', controller.find);
  basicRouter.post('/', injector(middlewares.post), controller.create);
  basicRouter.patch('/:id', injector(middlewares.patch), controller.patch);
  basicRouter.delete('/:id', injector(middlewares.delete), controller.delete);

  basicRouter.use(handlers.errorLogger(handlers.loggerControllers));
  basicRouter.use(handlers.errorHandler);

  return basicRouter;
}
