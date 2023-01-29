import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './pages/BasicLayout';
import { AuthPage } from './pages/Auth';
import { UsersPage } from './pages/Users';
import { TimetablePage } from './pages/Timetable';
import { LessonsPage } from './pages/Lessons';
import { StudentsPage } from './pages/Students';
import { SubscribtionsPage } from './pages/Subscribtions';

function Hello() {
  return <h1>Work in progress...</h1>;
}

export function Router() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Layout />} >
        <Route path='/auth' element={<AuthPage />} />
        <Route path='/users' element={<UsersPage />} />
        <Route path='/timetable' element={<TimetablePage />} />
        <Route path='/students' element={<StudentsPage />} />
        <Route path='/lessons' element={<LessonsPage />} />
        <Route path='/subscribtions' element={<SubscribtionsPage />} />
        <Route path='/finance' element={<Hello />} />
      </Route>
    </Routes>
  </BrowserRouter>
  );
}
