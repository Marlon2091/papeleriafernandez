const AppError = require('../utils/AppError');
const pool = require('../config/db');
const productosModel = require('../models/productos.model');

async function validarReferencias({ id_categoria, id_unidad, proveedores }) {
  if (!(await productosModel.categoriaExists(id_categoria))) {
    throw new AppError('id_categoria no existe o está inactiva', 400);
  }

  if (!(await productosModel.unidadExists(id_unidad))) {
    throw new AppError('id_unidad no existe o está inactiva', 400);
  }

  if (proveedores && proveedores.length) {
    const principales = proveedores.filter((p) => p.es_principal);
    if (principales.length > 1) {
      throw new AppError('Solo un proveedor puede marcarse como principal', 400);
    }

    for (const p of proveedores) {
      if (!p.id_proveedor || !(await productosModel.proveedorExists(p.id_proveedor))) {
        throw new AppError(`id_proveedor ${p.id_proveedor} no existe o está inactivo`, 400);
      }
    }
  }
}

async function listProductos({ id_categoria, id_proveedor } = {}) {
  return productosModel.findAll({ id_categoria, id_proveedor });
}

async function productosBajoStockMinimo() {
  return productosModel.findBajoStockMinimo();
}

async function getProductoById(id) {
  const producto = await productosModel.findById(id);
  if (!producto) throw new AppError('Producto no encontrado', 404);
  producto.proveedores = await productosModel.findProveedoresByProducto(id);
  return producto;
}

async function crearProducto(data) {
  const { nombre, id_categoria, id_unidad, proveedores = [] } = data;

  if (!nombre || !id_categoria || !id_unidad) {
    throw new AppError('nombre, id_categoria e id_unidad son obligatorios', 400);
  }

  await validarReferencias({ id_categoria, id_unidad, proveedores });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const id_producto = await productosModel.insert(conn, data);
    if (proveedores.length) {
      await productosModel.replaceProveedores(conn, id_producto, proveedores);
    }

    await conn.commit();
    return getProductoById(id_producto);
  } catch (error) {
    await conn.rollback();
    if (error.code === 'ER_DUP_ENTRY') {
      throw new AppError('Ya existe un producto con ese SKU', 409);
    }
    throw error;
  } finally {
    conn.release();
  }
}

async function actualizarProducto(id, data) {
  const { nombre, id_categoria, id_unidad, proveedores = [] } = data;

  if (!nombre || !id_categoria || !id_unidad) {
    throw new AppError('nombre, id_categoria e id_unidad son obligatorios', 400);
  }

  await getProductoById(id);
  await validarReferencias({ id_categoria, id_unidad, proveedores });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await productosModel.update(conn, id, data);
    await productosModel.replaceProveedores(conn, id, proveedores);

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    if (error.code === 'ER_DUP_ENTRY') {
      throw new AppError('Ya existe un producto con ese SKU', 409);
    }
    throw error;
  } finally {
    conn.release();
  }

  return getProductoById(id);
}

async function cambiarEstadoProducto(id, activo) {
  const ok = await productosModel.setActivo(id, activo);
  if (!ok) throw new AppError('Producto no encontrado', 404);
}

module.exports = {
  listProductos,
  productosBajoStockMinimo,
  getProductoById,
  crearProducto,
  actualizarProducto,
  cambiarEstadoProducto
};
