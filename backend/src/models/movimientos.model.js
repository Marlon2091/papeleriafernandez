const pool = require('../config/db');

// Bloquea la fila del producto dentro de la transacción del caller
// (FOR UPDATE) para evitar condiciones de carrera si dos movimientos
// llegan casi al mismo tiempo sobre el mismo producto.
async function lockProductoStock(conn, id_producto) {
  const [rows] = await conn.query(
    'SELECT stock_actual FROM productos WHERE id_producto = ? FOR UPDATE',
    [id_producto]
  );
  return rows[0] || null;
}

async function actualizarStock(conn, id_producto, nuevoStock) {
  await conn.execute(
    'UPDATE productos SET stock_actual = ? WHERE id_producto = ?',
    [nuevoStock, id_producto]
  );
}

async function insertMovimiento(conn, { id_producto, id_usuario, tipo, cantidad, motivo }) {
  const [result] = await conn.execute(
    'INSERT INTO movimientos_inventario (id_producto, id_usuario, tipo, cantidad, motivo) VALUES (?, ?, ?, ?, ?)',
    [id_producto, id_usuario, tipo, cantidad, motivo || null]
  );
  return result.insertId;
}

async function findAll({ id_producto, desde, hasta } = {}) {
  let sql = `
    SELECT m.*, u.nombre AS usuario_nombre, p.nombre AS producto_nombre
    FROM movimientos_inventario m
    JOIN usuarios u ON u.id_usuario = m.id_usuario
    JOIN productos p ON p.id_producto = m.id_producto
  `;
  const conditions = [];
  const params = [];

  if (id_producto) {
    conditions.push('m.id_producto = ?');
    params.push(id_producto);
  }
  if (desde) {
    conditions.push('m.creado_en >= ?');
    params.push(desde);
  }
  if (hasta) {
    conditions.push('m.creado_en <= ?');
    params.push(hasta);
  }

  if (conditions.length) {
    sql += ` WHERE ${conditions.join(' AND ')}`;
  }

  sql += ' ORDER BY m.creado_en DESC';

  const [rows] = await pool.execute(sql, params);
  return rows;
}

module.exports = { lockProductoStock, actualizarStock, insertMovimiento, findAll };
