import { Router } from 'express';
import { AuthController } from '../controllers';
import { errorLogger } from '../middleware';
import { loggerControllers } from '../logger';
import { checkLogin } from '../services';

const authRouter = Router();

authRouter.post('/login', checkLogin, AuthController.login);
authRouter.get('/logout', AuthController.logout);

authRouter.use(errorLogger(loggerControllers));

export default authRouter;
