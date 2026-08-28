const service = require('../services/productos.service');

async function list(req, res, next) {
  try {
    const { id_categoria, id_proveedor } = req.query;
    const data = await service.listProductos({ id_categoria, id_proveedor });
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
}

async function bajoStockMinimo(req, res, next) {
  try {
    res.json({ ok: true, data: await service.productosBajoStockMinimo() });
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    res.json({ ok: true, data: await service.getProductoById(req.params.id) });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const data = await service.crearProducto(req.body);
    res.status(201).json({ ok: true, data });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const data = await service.actualizarProducto(req.params.id, req.body);
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
}

async function deactivate(req, res, next) {
  try {
    await service.cambiarEstadoProducto(req.params.id, false);
    res.json({ ok: true, message: 'Producto desactivado' });
  } catch (error) {
    next(error);
  }
}

async function activate(req, res, next) {
  try {
    await service.cambiarEstadoProducto(req.params.id, true);
    res.json({ ok: true, message: 'Producto activado' });
  } catch (error) {
    next(error);
  }
}

module.exports = { list, bajoStockMinimo, getById, create, update, deactivate, activate };
