import { Router } from 'express';
// import { checkToken, checkAccess } from './shared/middlewares';
import authRouter from './components/Auth/routes';
import userRouter from './components/User/routes';
import studentRouter from './components/Student/routes';
import lessonRouter from './components/Lesson/routes';
import locationRouter from './components/Location/routes';
import roleRouter from './components/Role/routes';
import roleGroupsRouter from './components/RoleGroups/routes';
import subscriptionTemplateRouter from './components/SubscriptionTemplate/routes';
import subscriptionRouter from './components/Subscription/routes';
import visitStatusRouter from './components/VisitStatus/routes';
import visitedLessonRouter from './components/VisitedLesson/routes';

import { errorLogger, errorHandler } from './shared';
import { loggerControllers } from './config/logger';

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
router.use('/visitStatus', visitStatusRouter);
router.use('/visitedLesson', visitedLessonRouter);

router.use(errorLogger(loggerControllers));
router.use(errorHandler);

export { router };
