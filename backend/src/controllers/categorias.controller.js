const service = require('../services/categorias.service');

async function list(req, res, next) {
  try {
    res.json({ ok: true, data: await service.listCategorias() });
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    res.json({ ok: true, data: await service.getCategoriaById(req.params.id) });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const data = await service.crearCategoria(req.body);
    res.status(201).json({ ok: true, data });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const data = await service.actualizarCategoria(req.params.id, req.body);
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
}

async function deactivate(req, res, next) {
  try {
    await service.cambiarEstadoCategoria(req.params.id, false);
    res.json({ ok: true, message: 'Categoría desactivada' });
  } catch (error) {
    next(error);
  }
}

async function activate(req, res, next) {
  try {
    await service.cambiarEstadoCategoria(req.params.id, true);
    res.json({ ok: true, message: 'Categoría activada' });
  } catch (error) {
    next(error);
  }
}

module.exports = { list, getById, create, update, deactivate, activate };
