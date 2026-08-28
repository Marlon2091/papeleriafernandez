const pool = require('../config/db');

async function findAll() {
  const [rows] = await pool.execute('SELECT * FROM servicios ORDER BY nombre');
  return rows;
}

async function findById(id) {
  const [rows] = await pool.execute('SELECT * FROM servicios WHERE id_servicio = ?', [id]);
  return rows[0] || null;
}

async function insert({ nombre, descripcion, precio }) {
  const [result] = await pool.execute(
    'INSERT INTO servicios (nombre, descripcion, precio) VALUES (?, ?, ?)',
    [nombre, descripcion || null, precio || 0]
  );
  return result.insertId;
}

async function update(id, { nombre, descripcion, precio }) {
  const [result] = await pool.execute(
    'UPDATE servicios SET nombre = ?, descripcion = ?, precio = ? WHERE id_servicio = ?',
    [nombre, descripcion || null, precio || 0, id]
  );
  return result.affectedRows > 0;
}

async function setActivo(id, activo) {
  const [result] = await pool.execute(
    'UPDATE servicios SET activo = ? WHERE id_servicio = ?',
    [activo, id]
  );
  return result.affectedRows > 0;
}

module.exports = { findAll, findById, insert, update, setActivo };
