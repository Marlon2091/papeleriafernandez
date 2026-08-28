const service = require('../services/movimientos.service');

async function list(req, res, next) {
  try {
    const { id_producto, desde, hasta } = req.query;
    const data = await service.listMovimientos({ id_producto, desde, hasta });
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const data = await service.registrarMovimiento(req.body, req.user.id_usuario);
    res.status(201).json({ ok: true, data });
  } catch (error) {
    next(error);
  }
}

module.exports = { list, create };
