import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SingUpPage from './pages/SingUpPage';
import LoginPage from './pages/LoginPage';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div
      className='min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden'>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/signup' element={<SingUpPage />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
