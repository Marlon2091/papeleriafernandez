import { Filter } from 'lucide-react';

export default function MovimientoFilters({ productos, filters, onChange }) {
  function change(event) {
    onChange({ ...filters, [event.target.name]: event.target.value });
  }

  return (
    <div className="card form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', display: 'grid' }}>
      <select name="id_producto" value={filters.id_producto} onChange={change}>
        <option value="">Todos los productos</option>
        {productos.map((p) => (
          <option key={p.id_producto} value={p.id_producto}>{p.nombre}</option>
        ))}
      </select>

      <input name="desde" type="date" value={filters.desde} onChange={change} />
      <input name="hasta" type="date" value={filters.hasta} onChange={change} />

      <span className="footer-note" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Filter size={14} /> Filtros del historial
      </span>
    </div>
  );
}
