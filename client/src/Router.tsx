import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import { ProtectedLayout } from './pages/BasicLayout';
import { MainPage } from './pages/Main';
import { AuthPage } from './pages/Auth';
import { UsersPage } from './pages/Users';
import { UserPage } from './pages/User';
import { TimetablePage } from './pages/Timetable';
import { LessonsPage } from './pages/Lessons';
import { LessonPage } from './pages/Lesson';
import { AttendancePage } from './pages/Attendance';
import { StudentsPage } from './pages/Students';
import { StudentPage } from './pages/Student';
import { NotFoundPage } from './pages/NotFound';
import { FinancePage } from './pages/Finance';
import { PostponedAttendancesPage } from './pages/PostponedAttendances';
import { UnpaidAttendancesPage } from './pages/UnpaidAttendances';
import {
  SubscriptionsPageLayout,
  SubscriptionsTemplatePage,
  SubscriptionsPage,
  SubscriptionPage,
} from './pages/Subscriptions';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/auth' element={<AuthPage />} />

      <Route path='/' element={<ProtectedLayout />} >

        <Route path='/' element={<MainPage />} />

        <Route path='/timetable' element={<TimetablePage />} />

        <Route path='/attendances' >
          <Route path="history" element={<AttendancePage />} />
          <Route path='postponed' element={<PostponedAttendancesPage />} />
          <Route path='unpaid' element={<UnpaidAttendancesPage />} />
        </Route>

        <Route path='/students'>
          <Route index element={<StudentsPage />} />
          <Route path=':studentId' element={<StudentPage />} />
        </Route>

        <Route path='/lessons'>
          <Route index element={<LessonsPage />} />
          <Route path=':lessonId' element={<LessonPage />} />
        </Route>

        <Route path='/subscriptions' element={<SubscriptionsPageLayout />} >
          <Route index element={<SubscriptionsPage />} />
          <Route path='/subscriptions/templates' element={<SubscriptionsTemplatePage />} />
          <Route path=':subscriptionId' element={<SubscriptionPage />} />
        </Route>

        <Route path='/users'>
          <Route index element={<UsersPage />} />
          <Route path=':userId' element={<UserPage />} />
        </Route>

        <Route path='/finance' element={<FinancePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </>,
  ),
);
