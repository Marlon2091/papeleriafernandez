const pool = require('../config/db');

async function findAll() {
  const [rows] = await pool.execute('SELECT * FROM proveedores ORDER BY nombre');
  return rows;
}

async function findById(id) {
  const [rows] = await pool.execute('SELECT * FROM proveedores WHERE id_proveedor = ?', [id]);
  return rows[0] || null;
}

async function exists(id) {
  const [rows] = await pool.execute(
    'SELECT 1 FROM proveedores WHERE id_proveedor = ? AND activo = TRUE',
    [id]
  );
  return rows.length > 0;
}

async function insert({ nombre, contacto, telefono, email, direccion }) {
  const [result] = await pool.execute(
    'INSERT INTO proveedores (nombre, contacto, telefono, email, direccion) VALUES (?, ?, ?, ?, ?)',
    [nombre, contacto || null, telefono || null, email || null, direccion || null]
  );
  return result.insertId;
}

async function update(id, { nombre, contacto, telefono, email, direccion }) {
  const [result] = await pool.execute(
    'UPDATE proveedores SET nombre = ?, contacto = ?, telefono = ?, email = ?, direccion = ? WHERE id_proveedor = ?',
    [nombre, contacto || null, telefono || null, email || null, direccion || null, id]
  );
  return result.affectedRows > 0;
}

async function setActivo(id, activo) {
  const [result] = await pool.execute(
    'UPDATE proveedores SET activo = ? WHERE id_proveedor = ?',
    [activo, id]
  );
  return result.affectedRows > 0;
}

module.exports = { findAll, findById, exists, insert, update, setActivo };
