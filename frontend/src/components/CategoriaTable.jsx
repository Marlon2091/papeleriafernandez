import { Pencil, Power, PowerOff } from 'lucide-react';

export default function CategoriaTable({ categorias, canEdit, canToggleActivo, onEdit, onToggleActivo }) {
  if (!categorias.length) {
    return <p className="empty-state">Aún no hay categorías registradas.</p>;
  }

  const showActions = canEdit || canToggleActivo;

  return (
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Estado</th>
          {showActions && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {categorias.map((c) => (
          <tr key={c.id_categoria}>
            <td>{c.nombre}</td>
            <td>{c.descripcion}</td>
            <td>{c.activo ? 'Activa' : 'Inactiva'}</td>
            {showActions && (
              <td className="actions">
                {canEdit && (
                  <button type="button" className="edit" onClick={() => onEdit(c)}>
                    <Pencil size={14} />
                  </button>
                )}
                {canToggleActivo && (
                  <button type="button" className="secondary" onClick={() => onToggleActivo(c)}>
                    {c.activo ? <PowerOff size={14} /> : <Power size={14} />}
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
