import { Pencil, Power, PowerOff } from 'lucide-react';

export default function ProveedorTable({ proveedores, canEdit, canToggleActivo, onEdit, onToggleActivo }) {
  if (!proveedores.length) {
    return <p className="empty-state">Aún no hay proveedores registrados.</p>;
  }

  const showActions = canEdit || canToggleActivo;

  return (
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Contacto</th>
          <th>Teléfono</th>
          <th>Correo</th>
          <th>Estado</th>
          {showActions && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {proveedores.map((p) => (
          <tr key={p.id_proveedor}>
            <td>{p.nombre}</td>
            <td>{p.contacto}</td>
            <td>{p.telefono}</td>
            <td>{p.email}</td>
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
        ))}
      </tbody>
    </table>
  );
}
