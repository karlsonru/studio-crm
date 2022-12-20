import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './pages/BasicLayout';
import { AuthPage } from './pages/Auth';
import { UsersPage } from './pages/Users';
import { TimetablePage } from './pages/Timetable';
import { LessonsPage } from './pages/Lessons';

function Hello() {
  return <h1>Hello world!</h1>;
}

export function Router() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Layout />} >
        <Route path='/auth' element={<AuthPage />} />
        <Route path='/users' element={<UsersPage />} />
        <Route path='/timetable' element={<TimetablePage />} />
        <Route path='/students' element={<Hello />} />
        <Route path='/lessons' element={<LessonsPage />} />
        <Route path='/subscribtions' element={<Hello />} />
        <Route path='/finance' element={<Hello />} />
      </Route>
    </Routes>
  </BrowserRouter>
  );
}
