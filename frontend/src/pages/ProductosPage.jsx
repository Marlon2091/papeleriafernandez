import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProductoForm from '../components/ProductoForm';
import ProductoTable from '../components/ProductoTable';
import {
  activarProducto,
  createProducto,
  desactivarProducto,
  getProductos,
  updateProducto
} from '../services/productos.service';
import { getCategorias } from '../services/categorias.service';
import { getUnidadesMedida } from '../services/unidadesMedida.service';
import { getProveedores } from '../services/proveedores.service';

export default function ProductosPage() {
  const { user } = useAuth();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const canEdit = user?.rol === 'admin' || user?.rol === 'empleado';
  const canToggleActivo = user?.rol === 'admin';

  async function loadAll() {
    try {
      const [prod, cat, uni, prov] = await Promise.all([
        getProductos(),
        getCategorias(),
        getUnidadesMedida(),
        getProveedores()
      ]);
      setProductos(prod.data);
      setCategorias(cat.data);
      setUnidades(uni.data);
      setProveedores(prov.data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function save(data) {
    try {
      setError('');

      if (editing) {
        await updateProducto(editing.id_producto, data);
        setEditing(null);
      } else {
        await createProducto(data);
      }

      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleActivo(producto) {
    try {
      setError('');
      if (producto.activo) {
        await desactivarProducto(producto.id_producto);
      } else {
        await activarProducto(producto.id_producto);
      }
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="container">
      <header className="page-header">
        <h1>Productos</h1>
        <p>Sesión: {user?.email} · Rol: <strong>{user?.rol}</strong></p>
      </header>

      {error && <p className="error">{error}</p>}

      {canEdit && (
        <ProductoForm
          editing={editing}
          categorias={categorias}
          unidades={unidades}
          proveedores={proveedores}
          onSubmit={save}
          onCancel={() => setEditing(null)}
        />
      )}

      <ProductoTable
        productos={productos}
        canEdit={canEdit}
        canToggleActivo={canToggleActivo}
        onEdit={setEditing}
        onToggleActivo={toggleActivo}
      />
    </main>
  );
}
