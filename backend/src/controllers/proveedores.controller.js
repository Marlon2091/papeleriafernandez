const service = require('../services/proveedores.service');

async function list(req, res, next) {
  try {
    res.json({ ok: true, data: await service.listProveedores() });
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    res.json({ ok: true, data: await service.getProveedorById(req.params.id) });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const data = await service.crearProveedor(req.body);
    res.status(201).json({ ok: true, data });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const data = await service.actualizarProveedor(req.params.id, req.body);
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
}

async function deactivate(req, res, next) {
  try {
    await service.cambiarEstadoProveedor(req.params.id, false);
    res.json({ ok: true, message: 'Proveedor desactivado' });
  } catch (error) {
    next(error);
  }
}

async function activate(req, res, next) {
  try {
    await service.cambiarEstadoProveedor(req.params.id, true);
    res.json({ ok: true, message: 'Proveedor activado' });
  } catch (error) {
    next(error);
  }
}

module.exports = { list, getById, create, update, deactivate, activate };
