const pool = require('../config/db');

async function findAll({ id_categoria, id_proveedor } = {}) {
  const params = [];
  let sql = `
    SELECT p.*, c.nombre AS categoria_nombre, u.nombre AS unidad_nombre
    FROM productos p
    JOIN categorias c ON c.id_categoria = p.id_categoria
    JOIN unidades_medida u ON u.id_unidad = p.id_unidad
  `;

  if (id_proveedor) {
    sql += ' JOIN producto_proveedor pp ON pp.id_producto = p.id_producto AND pp.id_proveedor = ?';
    params.push(id_proveedor);
  }

  const conditions = [];
  if (id_categoria) {
    conditions.push('p.id_categoria = ?');
    params.push(id_categoria);
  }

  if (conditions.length) {
    sql += ` WHERE ${conditions.join(' AND ')}`;
  }

  sql += ' ORDER BY p.id_producto DESC';

  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.execute(
    `SELECT p.*, c.nombre AS categoria_nombre, u.nombre AS unidad_nombre
     FROM productos p
     JOIN categorias c ON c.id_categoria = p.id_categoria
     JOIN unidades_medida u ON u.id_unidad = p.id_unidad
     WHERE p.id_producto = ?`,
    [id]
  );
  return rows[0] || null;
}

async function findBajoStockMinimo() {
  const [rows] = await pool.execute(
    `SELECT p.*, c.nombre AS categoria_nombre, u.nombre AS unidad_nombre
     FROM productos p
     JOIN categorias c ON c.id_categoria = p.id_categoria
     JOIN unidades_medida u ON u.id_unidad = p.id_unidad
     WHERE p.activo = TRUE AND p.stock_actual <= p.stock_minimo
     ORDER BY (p.stock_minimo - p.stock_actual) DESC`
  );
  return rows;
}

async function findProveedoresByProducto(id_producto) {
  const [rows] = await pool.execute(
    `SELECT pp.id_proveedor, pp.precio_compra, pp.es_principal, pr.nombre AS proveedor_nombre
     FROM producto_proveedor pp
     JOIN proveedores pr ON pr.id_proveedor = pp.id_proveedor
     WHERE pp.id_producto = ?
     ORDER BY pp.es_principal DESC, pr.nombre`,
    [id_producto]
  );
  return rows;
}

// insert/update/replaceProveedores reciben `conn` (una conexión con transacción
// abierta) porque siempre se usan junto con la sincronización de
// producto_proveedor dentro de la misma transacción — nunca sueltas.

async function insert(conn, { sku, nombre, descripcion, id_categoria, id_unidad, precio_venta, stock_actual, stock_minimo }) {
  const [result] = await conn.execute(
    `INSERT INTO productos (sku, nombre, descripcion, id_categoria, id_unidad, precio_venta, stock_actual, stock_minimo)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      sku || null,
      nombre,
      descripcion || null,
      id_categoria,
      id_unidad,
      precio_venta || 0,
      stock_actual || 0,
      stock_minimo || 0
    ]
  );
  return result.insertId;
}

async function update(conn, id, { sku, nombre, descripcion, id_categoria, id_unidad, precio_venta, stock_minimo }) {
  const [result] = await conn.execute(
    `UPDATE productos
     SET sku = ?, nombre = ?, descripcion = ?, id_categoria = ?, id_unidad = ?, precio_venta = ?, stock_minimo = ?
     WHERE id_producto = ?`,
    [sku || null, nombre, descripcion || null, id_categoria, id_unidad, precio_venta || 0, stock_minimo || 0, id]
  );
  return result.affectedRows > 0;
}

async function replaceProveedores(conn, id_producto, proveedores) {
  await conn.execute('DELETE FROM producto_proveedor WHERE id_producto = ?', [id_producto]);

  for (const p of proveedores) {
    await conn.execute(
      'INSERT INTO producto_proveedor (id_producto, id_proveedor, precio_compra, es_principal) VALUES (?, ?, ?, ?)',
      [id_producto, p.id_proveedor, p.precio_compra || 0, Boolean(p.es_principal)]
    );
  }
}

async function setActivo(id, activo) {
  const [result] = await pool.execute(
    'UPDATE productos SET activo = ? WHERE id_producto = ?',
    [activo, id]
  );
  return result.affectedRows > 0;
}

async function categoriaExists(id) {
  const [rows] = await pool.execute(
    'SELECT 1 FROM categorias WHERE id_categoria = ? AND activo = TRUE',
    [id]
  );
  return rows.length > 0;
}

async function unidadExists(id) {
  const [rows] = await pool.execute(
    'SELECT 1 FROM unidades_medida WHERE id_unidad = ? AND activo = TRUE',
    [id]
  );
  return rows.length > 0;
}

async function proveedorExists(id) {
  const [rows] = await pool.execute(
    'SELECT 1 FROM proveedores WHERE id_proveedor = ? AND activo = TRUE',
    [id]
  );
  return rows.length > 0;
}

module.exports = {
  findAll,
  findById,
  findBajoStockMinimo,
  findProveedoresByProducto,
  insert,
  update,
  replaceProveedores,
  setActivo,
  categoriaExists,
  unidadExists,
  proveedorExists
};
