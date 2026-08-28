import { useState } from 'react';
import { Save } from 'lucide-react';

const EMPTY_FORM = { id_producto: '', tipo: 'entrada', cantidad: '', motivo: '' };

const TIPOS = [
  { value: 'entrada', label: 'Entrada' },
  { value: 'salida', label: 'Salida' },
  { value: 'ajuste_positivo', label: 'Ajuste (sube stock)' },
  { value: 'ajuste_negativo', label: 'Ajuste (baja stock)' }
];

export default function MovimientoForm({ productos, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    await onSubmit({
      id_producto: Number(form.id_producto),
      tipo: form.tipo,
      cantidad: Number(form.cantidad),
      motivo: form.motivo || null
    });
    setForm(EMPTY_FORM);
  }

  return (
    <form className="card form-grid" onSubmit={submit}>
      <h2>Registrar movimiento</h2>

      <select name="id_producto" value={form.id_producto} onChange={change} required>
        <option value="">Selecciona producto</option>
        {productos.map((p) => (
          <option key={p.id_producto} value={p.id_producto}>
            {p.nombre} (stock: {p.stock_actual})
          </option>
        ))}
      </select>

      <select name="tipo" value={form.tipo} onChange={change} required>
        {TIPOS.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>

      <input
        name="cantidad"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="Cantidad"
        value={form.cantidad}
        onChange={change}
        required
      />

      <input name="motivo" placeholder="Motivo (opcional)" value={form.motivo} onChange={change} />

      <div className="actions">
        <button type="submit">
          <Save size={16} />
          Registrar
        </button>
      </div>
    </form>
  );
}
