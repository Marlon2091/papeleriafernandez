const service = require('../services/unidadesMedida.service');

async function list(req, res, next) {
  try {
    res.json({ ok: true, data: await service.listUnidades() });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const data = await service.crearUnidad(req.body);
    res.status(201).json({ ok: true, data });
  } catch (error) {
    next(error);
  }
}

module.exports = { list, create };
