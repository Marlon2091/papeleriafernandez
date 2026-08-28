import { useEffect, useState } from 'react';
import { AlertTriangle, PackageCheck } from 'lucide-react';
import { getProductosBajoStockMinimo } from '../services/productos.service';

export default function DashboardPage() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getProductosBajoStockMinimo()
      .then((result) => setProductos(result.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoaded(true));
  }, []);

  return (
    <main className="container">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Productos con stock en o por debajo del mínimo definido.</p>
      </header>

      {error && <p className="error">{error}</p>}

      {loaded && !productos.length && !error && (
        <div className="card empty-state">
          <PackageCheck size={32} />
          <p>Todos los productos tienen stock por encima del mínimo.</p>
        </div>
      )}

      {productos.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Stock actual</th>
              <th>Stock mínimo</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id_producto}>
                <td>{p.nombre}</td>
                <td>{p.categoria_nombre}</td>
                <td style={{ color: 'var(--gray-900)', fontWeight: 700 }}>
                  <AlertTriangle size={14} style={{ verticalAlign: 'text-bottom', marginRight: 4 }} />
                  {p.stock_actual}
                </td>
                <td>{p.stock_minimo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
