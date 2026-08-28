const TIPO_LABEL = {
  entrada: 'Entrada',
  salida: 'Salida',
  ajuste_positivo: 'Ajuste (+)',
  ajuste_negativo: 'Ajuste (-)'
};

export default function MovimientoTable({ movimientos }) {
  if (!movimientos.length) {
    return <p className="empty-state">No hay movimientos para los filtros seleccionados.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Producto</th>
          <th>Tipo</th>
          <th>Cantidad</th>
          <th>Motivo</th>
          <th>Usuario</th>
        </tr>
      </thead>
      <tbody>
        {movimientos.map((m) => (
          <tr key={m.id_movimiento}>
            <td>{new Date(m.creado_en).toLocaleString('es-CO')}</td>
            <td>{m.producto_nombre}</td>
            <td>{TIPO_LABEL[m.tipo] || m.tipo}</td>
            <td>{m.cantidad}</td>
            <td>{m.motivo}</td>
            <td>{m.usuario_nombre}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
