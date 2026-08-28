import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import MovimientoForm from '../components/MovimientoForm';
import MovimientoFilters from '../components/MovimientoFilters';
import MovimientoTable from '../components/MovimientoTable';
import { createMovimiento, getMovimientos } from '../services/movimientos.service';
import { getProductos } from '../services/productos.service';

const EMPTY_FILTERS = { id_producto: '', desde: '', hasta: '' };

export default function MovimientosPage() {
  const { user } = useAuth();
  const [productos, setProductos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [error, setError] = useState('');

  const canRegistrar = user?.rol === 'admin' || user?.rol === 'empleado';

  async function loadProductos() {
    try {
      const result = await getProductos();
      setProductos(result.data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function loadMovimientos() {
    try {
      const result = await getMovimientos(filters);
      setMovimientos(result.data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadProductos();
  }, []);

  useEffect(() => {
    loadMovimientos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  async function registrar(data) {
    try {
      setError('');
      await createMovimiento(data);
      await Promise.all([loadProductos(), loadMovimientos()]);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="container">
      <header className="page-header">
        <h1>Movimientos de inventario</h1>
      </header>

      {error && <p className="error">{error}</p>}

      {canRegistrar && <MovimientoForm productos={productos} onSubmit={registrar} />}

      <div className="section-block">
        <h2>Historial</h2>
        <MovimientoFilters productos={productos} filters={filters} onChange={setFilters} />
        <MovimientoTable movimientos={movimientos} />
      </div>
    </main>
  );
}
