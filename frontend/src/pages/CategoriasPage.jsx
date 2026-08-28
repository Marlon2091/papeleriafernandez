import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import CategoriaForm from '../components/CategoriaForm';
import CategoriaTable from '../components/CategoriaTable';
import {
  activarCategoria,
  createCategoria,
  desactivarCategoria,
  getCategorias,
  updateCategoria
} from '../services/categorias.service';

export default function CategoriasPage() {
  const { user } = useAuth();
  const [categorias, setCategorias] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const canEdit = user?.rol === 'admin' || user?.rol === 'empleado';
  const canToggleActivo = user?.rol === 'admin';

  async function load() {
    try {
      const result = await getCategorias();
      setCategorias(result.data);
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
        await updateCategoria(editing.id_categoria, data);
        setEditing(null);
      } else {
        await createCategoria(data);
      }
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleActivo(categoria) {
    try {
      setError('');
      if (categoria.activo) {
        await desactivarCategoria(categoria.id_categoria);
      } else {
        await activarCategoria(categoria.id_categoria);
      }
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="container">
      <header className="page-header">
        <h1>Categorías</h1>
      </header>

      {error && <p className="error">{error}</p>}

      {canEdit && (
        <CategoriaForm editing={editing} onSubmit={save} onCancel={() => setEditing(null)} />
      )}

      <CategoriaTable
        categorias={categorias}
        canEdit={canEdit}
        canToggleActivo={canToggleActivo}
        onEdit={setEditing}
        onToggleActivo={toggleActivo}
      />
    </main>
  );
}
