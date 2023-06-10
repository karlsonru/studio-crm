import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedLayout } from './pages/BasicLayout';
import { AuthPage } from './pages/Auth';
import { UsersPage } from './pages/Users';
import { UserPage } from './pages/User';
import { TimetablePage } from './pages/Timetable';
import { LessonsPage } from './pages/Lessons';
import { LessonPage } from './pages/Lesson';
import { VisititedLessonsPage } from './pages/VisitedLessons';
import { StudentsPage } from './pages/Students';
import { StudentPage } from './pages/Student';
import { NotFoundPage } from './pages/NotFound';
import { SubscriptionsPageLayout, SubscriptionsTemplatePage, SubscriptionsPage } from './pages/Subscriptions';

function Hello() {
  return <h1>Work in progress...</h1>;
}

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth' element={<AuthPage />} />

        <Route path='/' element={<ProtectedLayout />} >

          <Route path='/timetable' element={<TimetablePage />} />

          <Route path='/visits' element={<VisititedLessonsPage />} />

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
            <Route path=':templates' element={<SubscriptionsTemplatePage />} />
          </Route>

          <Route path='/users'>
            <Route index element={<UsersPage />} />
            <Route path=':userId' element={<UserPage />} />
          </Route>

          <Route path='/finance' element={<Hello />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
