import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Instalaciones from './pages/Instalaciones';
import Tecnicos from './pages/Tecnicos';
import Productos from './pages/Productos';
import Operadores from './pages/Operadores';
import Acometidas from './pages/Acometidas';
import DrPage from './pages/Dr';
import TiposOrden from './pages/TiposOrden';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="instalaciones" element={<Instalaciones />} />
          <Route path="tecnicos" element={<Tecnicos />} />
          <Route path="productos" element={<Productos />} />
          <Route path="operadores" element={<Operadores />} />
          <Route path="acometidas" element={<Acometidas />} />
          <Route path="dr" element={<DrPage />} />
          <Route path="tipos-orden" element={<TiposOrden />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
