export default function UnidadTable({ unidades }) {
  if (!unidades.length) {
    return <p className="empty-state">Aún no hay unidades de medida registradas.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {unidades.map((u) => (
          <tr key={u.id_unidad}>
            <td>{u.nombre}</td>
            <td>{u.activo ? 'Activa' : 'Inactiva'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
