const service = require('../services/servicios.service');

async function list(req, res, next) {
  try {
    res.json({ ok: true, data: await service.listServicios() });
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    res.json({ ok: true, data: await service.getServicioById(req.params.id) });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const data = await service.crearServicio(req.body);
    res.status(201).json({ ok: true, data });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const data = await service.actualizarServicio(req.params.id, req.body);
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
}

async function deactivate(req, res, next) {
  try {
    await service.cambiarEstadoServicio(req.params.id, false);
    res.json({ ok: true, message: 'Servicio desactivado' });
  } catch (error) {
    next(error);
  }
}

async function activate(req, res, next) {
  try {
    await service.cambiarEstadoServicio(req.params.id, true);
    res.json({ ok: true, message: 'Servicio activado' });
  } catch (error) {
    next(error);
  }
}

module.exports = { list, getById, create, update, deactivate, activate };
