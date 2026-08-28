import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import ServicioForm from '../components/ServicioForm';
import ServicioTable from '../components/ServicioTable';
import {
  activarServicio,
  createServicio,
  desactivarServicio,
  getServicios,
  updateServicio
} from '../services/servicios.service';

export default function ServiciosPage() {
  const { user } = useAuth();
  const [servicios, setServicios] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const canEdit = user?.rol === 'admin' || user?.rol === 'empleado';
  const canToggleActivo = user?.rol === 'admin';

  async function load() {
    try {
      const result = await getServicios();
      setServicios(result.data);
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
        await updateServicio(editing.id_servicio, data);
        setEditing(null);
      } else {
        await createServicio(data);
      }
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleActivo(servicio) {
    try {
      setError('');
      if (servicio.activo) {
        await desactivarServicio(servicio.id_servicio);
      } else {
        await activarServicio(servicio.id_servicio);
      }
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="container">
      <header className="page-header">
        <h1>Servicios</h1>
        <p>Corte de papel, impresión, plastificado, argollado, sellos, digitalización — no afectan inventario.</p>
      </header>

      {error && <p className="error">{error}</p>}

      {canEdit && (
        <ServicioForm editing={editing} onSubmit={save} onCancel={() => setEditing(null)} />
      )}

      <ServicioTable
        servicios={servicios}
        canEdit={canEdit}
        canToggleActivo={canToggleActivo}
        onEdit={setEditing}
        onToggleActivo={toggleActivo}
      />
    </main>
  );
}
