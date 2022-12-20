import { Router } from 'express';
import { AuthController } from './controller';
import { checkLogin, injectMiddlewares } from '../../shared/middlewares';

const authRouter = Router();

authRouter.post('/login', injectMiddlewares([checkLogin]), AuthController.login);

export default authRouter;
