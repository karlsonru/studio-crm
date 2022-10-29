import { Router } from 'express';
import { AuthController } from './controller';
import { loggerControllers } from '../../config/logger';
import { errorLogger, errorHandler } from '../../shared';
import { checkLogin, injectMiddlewares } from '../../shared/middlewares';

const authRouter = Router();

authRouter.post('/login', injectMiddlewares([checkLogin]), AuthController.login);

authRouter.use(errorLogger(loggerControllers));
authRouter.use(errorHandler);

export default authRouter;
