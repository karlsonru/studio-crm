import { Router } from 'express';

// @ts-ignore
export function createBasicRouter(controller, middlewares, handlers) {
  const basicRouter = Router();

  const validate = middlewares.validationMiddleware;

  basicRouter.get('/', controller.getAll);
  basicRouter.get('/:id', validate(middlewares.get), controller.getOne);
  basicRouter.post('/find', controller.find);
  basicRouter.post('/', validate(middlewares.post), middlewares.injectQuery(middlewares.query), controller.create);
  basicRouter.patch('/:id', validate(middlewares.patch), controller.patch);
  basicRouter.delete('/:id', validate(middlewares.delete), controller.delete);

  basicRouter.use(handlers.errorLogger(handlers.loggerControllers));
  basicRouter.use(handlers.errorHandler);

  return basicRouter;
}
