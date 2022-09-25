import { Router } from 'express';
import { AuthController } from './controller';
import { loggerControllers } from '../config/logger';
import { errorLogger, checkLogin } from '../shared';

const authRouter = Router();

authRouter.post('/login', checkLogin, AuthController.login);
authRouter.get('/logout', AuthController.logout);

authRouter.use(errorLogger(loggerControllers));

export default authRouter;
