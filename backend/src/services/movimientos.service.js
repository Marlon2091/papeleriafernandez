const AppError = require('../utils/AppError');
const pool = require('../config/db');
const movimientosModel = require('../models/movimientos.model');

const TIPOS_ENTRADA = ['entrada', 'ajuste_positivo'];
const TIPOS_SALIDA = ['salida', 'ajuste_negativo'];
const TIPOS_VALIDOS = [...TIPOS_ENTRADA, ...TIPOS_SALIDA];

// id_usuario viene siempre del JWT verificado (req.user en el controller),
// nunca del body — así el cliente no puede registrar un movimiento a
// nombre de otro usuario.
async function registrarMovimiento({ id_producto, tipo, cantidad, motivo }, id_usuario) {
  if (!id_producto || !tipo || cantidad === undefined) {
    throw new AppError('id_producto, tipo y cantidad son obligatorios', 400);
  }

  if (!TIPOS_VALIDOS.includes(tipo)) {
    throw new AppError(`tipo debe ser uno de: ${TIPOS_VALIDOS.join(', ')}`, 400);
  }

  const cantidadNum = Number(cantidad);
  if (!Number.isFinite(cantidadNum) || cantidadNum <= 0) {
    throw new AppError('cantidad debe ser un número mayor a 0', 400);
  }

  const delta = TIPOS_ENTRADA.includes(tipo) ? cantidadNum : -cantidadNum;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const producto = await movimientosModel.lockProductoStock(conn, id_producto);
    if (!producto) {
      throw new AppError('Producto no encontrado', 404);
    }

    const nuevoStock = Number(producto.stock_actual) + delta;
    if (nuevoStock < 0) {
      throw new AppError('El movimiento dejaría el stock en negativo', 409);
    }

    await movimientosModel.actualizarStock(conn, id_producto, nuevoStock);
    const id_movimiento = await movimientosModel.insertMovimiento(conn, {
      id_producto,
      id_usuario,
      tipo,
      cantidad: cantidadNum,
      motivo
    });

    await conn.commit();
    return { id_movimiento, stock_actual: nuevoStock };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

async function listMovimientos({ id_producto, desde, hasta } = {}) {
  return movimientosModel.findAll({ id_producto, desde, hasta });
}

module.exports = { registrarMovimiento, listMovimientos };
