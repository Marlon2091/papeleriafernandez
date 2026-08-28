import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProductosPage from './pages/ProductosPage';
import CategoriasPage from './pages/CategoriasPage';
import ProveedoresPage from './pages/ProveedoresPage';
import ServiciosPage from './pages/ServiciosPage';
import MovimientosPage from './pages/MovimientosPage';
import UsuariosPage from './pages/UsuariosPage';
import './assets/styles.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/productos" element={<ProductosPage />} />
              <Route path="/categorias" element={<CategoriasPage />} />
              <Route path="/proveedores" element={<ProveedoresPage />} />
              <Route path="/servicios" element={<ServiciosPage />} />
              <Route path="/movimientos" element={<MovimientosPage />} />

              <Route element={<RoleRoute roles={['admin']} />}>
                <Route path="/usuarios" element={<UsuariosPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
