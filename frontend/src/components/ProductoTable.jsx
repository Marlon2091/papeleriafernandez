import { Pencil, PowerOff, Power } from 'lucide-react';

function money(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }) : value;
}

export default function ProductoTable({ productos, canEdit, canToggleActivo, onEdit, onToggleActivo }) {
  if (!productos.length) {
    return <p className="empty-state">Aún no hay productos registrados.</p>;
  }

  const showActions = canEdit || canToggleActivo;

  return (
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Unidad</th>
          <th>Precio venta</th>
          <th>Stock</th>
          <th>Estado</th>
          {showActions && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {productos.map((p) => {
          const bajoMinimo = Number(p.stock_actual) <= Number(p.stock_minimo);
          return (
            <tr key={p.id_producto}>
              <td>{p.nombre}{p.sku ? <small> · {p.sku}</small> : null}</td>
              <td>{p.categoria_nombre}</td>
              <td>{p.unidad_nombre}</td>
              <td>{money(p.precio_venta)}</td>
              <td style={bajoMinimo ? { color: 'var(--gray-900)', fontWeight: 700 } : undefined}>
                {p.stock_actual} {bajoMinimo && '⚠'}
              </td>
              <td>{p.activo ? 'Activo' : 'Inactivo'}</td>
              {showActions && (
                <td className="actions">
                  {canEdit && (
                    <button type="button" className="edit" onClick={() => onEdit(p)}>
                      <Pencil size={14} />
                    </button>
                  )}
                  {canToggleActivo && (
                    <button type="button" className="secondary" onClick={() => onToggleActivo(p)}>
                      {p.activo ? <PowerOff size={14} /> : <Power size={14} />}
                    </button>
                  )}
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
