import { useEffect, useState } from 'react';
import { Save, X } from 'lucide-react';

const EMPTY_FORM = { nombre: '', contacto: '', telefono: '', email: '', direccion: '' };

export default function ProveedorForm({ editing, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    setForm(
      editing
        ? {
            nombre: editing.nombre,
            contacto: editing.contacto || '',
            telefono: editing.telefono || '',
            email: editing.email || '',
            direccion: editing.direccion || ''
          }
        : EMPTY_FORM
    );
  }, [editing]);

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function submit(event) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <form className="card form-grid" onSubmit={submit}>
      <h2>{editing ? 'Editar proveedor' : 'Nuevo proveedor'}</h2>
      <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={change} required />
      <input name="contacto" placeholder="Persona de contacto" value={form.contacto} onChange={change} />
      <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={change} />
      <input name="email" type="email" placeholder="Correo" value={form.email} onChange={change} />
      <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={change} />
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
