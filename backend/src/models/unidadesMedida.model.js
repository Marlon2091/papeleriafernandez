const pool = require('../config/db');

async function findAll() {
  const [rows] = await pool.execute('SELECT * FROM unidades_medida ORDER BY nombre');
  return rows;
}

async function findById(id) {
  const [rows] = await pool.execute('SELECT * FROM unidades_medida WHERE id_unidad = ?', [id]);
  return rows[0] || null;
}

async function exists(id) {
  const [rows] = await pool.execute(
    'SELECT 1 FROM unidades_medida WHERE id_unidad = ? AND activo = TRUE',
    [id]
  );
  return rows.length > 0;
}

async function insert({ nombre }) {
  const [result] = await pool.execute(
    'INSERT INTO unidades_medida (nombre) VALUES (?)',
    [nombre]
  );
  return result.insertId;
}

module.exports = { findAll, findById, exists, insert };
