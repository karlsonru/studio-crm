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
        <Route path='/' element={<Hello />} />
        <Route path='/auth' element={<AuthPage />} />
        <Route path='/users' element={<UsersPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
