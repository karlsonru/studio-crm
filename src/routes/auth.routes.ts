import { Router } from 'express';
import { AuthController } from '../controllers';
import { errorLogger } from '../middleware';
import { loggerControllers } from '../logger';

const authRouter = Router();

authRouter.post('/login', AuthController.login);
authRouter.get('/logout', AuthController.logout);

authRouter.use(errorLogger(loggerControllers));

export default authRouter;
