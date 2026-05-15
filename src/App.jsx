import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth' element={<AuthPage />} />
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
}
