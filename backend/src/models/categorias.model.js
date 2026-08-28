const pool = require('../config/db');

async function findAll() {
  const [rows] = await pool.execute('SELECT * FROM categorias ORDER BY nombre');
  return rows;
}

async function findById(id) {
  const [rows] = await pool.execute('SELECT * FROM categorias WHERE id_categoria = ?', [id]);
  return rows[0] || null;
}

async function exists(id) {
  const [rows] = await pool.execute(
    'SELECT 1 FROM categorias WHERE id_categoria = ? AND activo = TRUE',
    [id]
  );
  return rows.length > 0;
}

async function insert({ nombre, descripcion }) {
  const [result] = await pool.execute(
    'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
    [nombre, descripcion || null]
  );
  return result.insertId;
}

async function update(id, { nombre, descripcion }) {
  const [result] = await pool.execute(
    'UPDATE categorias SET nombre = ?, descripcion = ? WHERE id_categoria = ?',
    [nombre, descripcion || null, id]
  );
  return result.affectedRows > 0;
}

async function setActivo(id, activo) {
  const [result] = await pool.execute(
    'UPDATE categorias SET activo = ? WHERE id_categoria = ?',
    [activo, id]
  );
  return result.affectedRows > 0;
}

module.exports = { findAll, findById, exists, insert, update, setActivo };
