import { Layout } from './pages/BasicLayout';
import { AuthPage } from './pages/Auth';
import { UsersPage } from './pages/Users';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function Hello() {
  return <h1>Hello world!</h1>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/index' index element={<Layout page={<Hello />} />} />
        <Route path='/auth' element={<AuthPage />} />
        <Route path='/users' element={<UsersPage />} />
        <Route path='/timetable' element={<Layout page={<Hello />} />} />
        <Route path='/students' element={<Layout page={<Hello />} />} />
        <Route path='/lessons' element={<Layout page={<Hello />} />} />
        <Route path='/subscribtions' element={<Layout page={<Hello />} />} />
        <Route path='/finance' element={<Layout page={<Hello />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
