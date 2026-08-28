const AppError = require('../utils/AppError');
const serviciosModel = require('../models/servicios.model');

async function listServicios() {
  return serviciosModel.findAll();
}

async function getServicioById(id) {
  const servicio = await serviciosModel.findById(id);
  if (!servicio) throw new AppError('Servicio no encontrado', 404);
  return servicio;
}

async function crearServicio({ nombre, descripcion, precio }) {
  if (!nombre) throw new AppError('nombre es obligatorio', 400);

  const id_servicio = await serviciosModel.insert({ nombre, descripcion, precio });
  return getServicioById(id_servicio);
}

async function actualizarServicio(id, { nombre, descripcion, precio }) {
  if (!nombre) throw new AppError('nombre es obligatorio', 400);
  await getServicioById(id);

  await serviciosModel.update(id, { nombre, descripcion, precio });
  return getServicioById(id);
}

async function cambiarEstadoServicio(id, activo) {
  const ok = await serviciosModel.setActivo(id, activo);
  if (!ok) throw new AppError('Servicio no encontrado', 404);
}

module.exports = {
  listServicios,
  getServicioById,
  crearServicio,
  actualizarServicio,
  cambiarEstadoServicio
};
