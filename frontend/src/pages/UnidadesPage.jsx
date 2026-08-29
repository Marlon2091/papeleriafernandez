import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import UnidadForm from '../components/UnidadForm';
import UnidadTable from '../components/UnidadTable';
import { createUnidadMedida, getUnidadesMedida } from '../services/unidadesMedida.service';

export default function UnidadesPage() {
  const { user } = useAuth();
  const [unidades, setUnidades] = useState([]);
  const [error, setError] = useState('');

  const canEdit = user?.rol === 'admin' || user?.rol === 'empleado';

  async function load() {
    try {
      const result = await getUnidadesMedida();
      setUnidades(result.data);
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
      await createUnidadMedida(data);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="container">
      <header className="page-header">
        <h1>Unidades de medida</h1>
      </header>

      {error && <p className="error">{error}</p>}

      {canEdit && <UnidadForm onSubmit={save} />}

      <UnidadTable unidades={unidades} />
    </main>
  );
}
