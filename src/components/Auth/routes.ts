import { Router } from 'express';
import { AuthController } from './controller';
import { loggerControllers } from '../../config/logger';
import { errorLogger, errorHandler } from '../../shared';
import { checkLogin, validationMiddleware } from '../../shared/validationMiddlewares';

const authRouter = Router();

authRouter.post('/login', validationMiddleware([checkLogin]), AuthController.login);

authRouter.use(errorLogger(loggerControllers));
authRouter.use(errorHandler);

export default authRouter;
