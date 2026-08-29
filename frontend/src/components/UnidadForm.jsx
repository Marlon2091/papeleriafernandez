import { useState } from 'react';
import { Save } from 'lucide-react';

const EMPTY_FORM = { nombre: '' };

export default function UnidadForm({ onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function submit(event) {
    event.preventDefault();
    onSubmit(form);
    setForm(EMPTY_FORM);
  }

  return (
    <form className="card form-grid" onSubmit={submit}>
      <h2>Nueva unidad de medida</h2>
      <input name="nombre" placeholder="Nombre (ej. Pieza, Caja, Kilogramo)" value={form.nombre} onChange={change} required />
      <div className="actions">
        <button type="submit">
          <Save size={16} />
          Crear
        </button>
      </div>
    </form>
  );
}
