import { Pencil, Power, PowerOff } from 'lucide-react';

function money(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }) : value;
}

export default function ServicioTable({ servicios, canEdit, canToggleActivo, onEdit, onToggleActivo }) {
  if (!servicios.length) {
    return <p className="empty-state">Aún no hay servicios registrados.</p>;
  }

  const showActions = canEdit || canToggleActivo;

  return (
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Precio</th>
          <th>Estado</th>
          {showActions && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {servicios.map((s) => (
          <tr key={s.id_servicio}>
            <td>{s.nombre}</td>
            <td>{s.descripcion}</td>
            <td>{money(s.precio)}</td>
            <td>{s.activo ? 'Activo' : 'Inactivo'}</td>
            {showActions && (
              <td className="actions">
                {canEdit && (
                  <button type="button" className="edit" onClick={() => onEdit(s)}>
                    <Pencil size={14} />
                  </button>
                )}
                {canToggleActivo && (
                  <button type="button" className="secondary" onClick={() => onToggleActivo(s)}>
                    {s.activo ? <PowerOff size={14} /> : <Power size={14} />}
                  </button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
