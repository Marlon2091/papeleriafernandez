import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProveedorForm from '../components/ProveedorForm';
import ProveedorTable from '../components/ProveedorTable';
import {
  activarProveedor,
  createProveedor,
  desactivarProveedor,
  getProveedores,
  updateProveedor
} from '../services/proveedores.service';

export default function ProveedoresPage() {
  const { user } = useAuth();
  const [proveedores, setProveedores] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const canEdit = user?.rol === 'admin' || user?.rol === 'empleado';
  const canToggleActivo = user?.rol === 'admin';

  async function load() {
    try {
      const result = await getProveedores();
      setProveedores(result.data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save(data) {
    try {
      setError('');
      if (editing) {
        await updateProveedor(editing.id_proveedor, data);
        setEditing(null);
      } else {
        await createProveedor(data);
      }
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleActivo(proveedor) {
    try {
      setError('');
      if (proveedor.activo) {
        await desactivarProveedor(proveedor.id_proveedor);
      } else {
        await activarProveedor(proveedor.id_proveedor);
      }
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="container">
      <header className="page-header">
        <h1>Proveedores</h1>
      </header>

      {error && <p className="error">{error}</p>}

      {canEdit && (
        <ProveedorForm editing={editing} onSubmit={save} onCancel={() => setEditing(null)} />
      )}

      <ProveedorTable
        proveedores={proveedores}
        canEdit={canEdit}
        canToggleActivo={canToggleActivo}
        onEdit={setEditing}
        onToggleActivo={toggleActivo}
      />
    </main>
  );
}
