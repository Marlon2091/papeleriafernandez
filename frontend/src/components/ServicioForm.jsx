import { useEffect, useState } from 'react';
import { Save, X } from 'lucide-react';

const EMPTY_FORM = { nombre: '', descripcion: '', precio: '' };

export default function ServicioForm({ editing, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    setForm(
      editing
        ? { nombre: editing.nombre, descripcion: editing.descripcion || '', precio: editing.precio || '' }
        : EMPTY_FORM
    );
  }, [editing]);

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function submit(event) {
    event.preventDefault();
    onSubmit({ ...form, precio: Number(form.precio) || 0 });
  }

  return (
    <form className="card form-grid" onSubmit={submit}>
      <h2>{editing ? 'Editar servicio' : 'Nuevo servicio'}</h2>
      <input name="nombre" placeholder="Nombre (ej. Argollado espiral)" value={form.nombre} onChange={change} required />
      <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={change} />
      <input name="precio" type="number" step="0.01" min="0" placeholder="Precio" value={form.precio} onChange={change} />
      <div className="actions">
        <button type="submit">
          <Save size={16} />
          {editing ? 'Guardar cambios' : 'Crear'}
        </button>
        {editing && (
          <button type="button" className="secondary" onClick={onCancel}>
            <X size={16} />
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
