import { Router } from 'express';
import authRouter from './components/Auth/routes';
import userRouter from './components/User/routes';
import studentRouter from './components/Student/routes';
import lessonRouter from './components/Lesson/routes';
import locationRouter from './components/Location/routes';
import roleRouter from './components/Role/routes';
import roleGroupsRouter from './components/RoleGroups/routes';
import subscriptionTemplateRouter from './components/SubscriptionTemplate/routes';
import subscriptionRouter from './components/Subscription/routes';
// import { checkToken, checkAccess } from './shared/middlewares';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter); // мы проверяем дступ для группы. Сюда доступ для группы "Владельцы"
router.use('/role', roleRouter);
router.use('/rolesGroup', roleGroupsRouter);
router.use('/location', locationRouter);
router.use('/lesson', lessonRouter);
router.use('/student', studentRouter);
router.use('/subsciption/templates', subscriptionTemplateRouter);
router.use('/subsciption', subscriptionRouter);

export { router };
