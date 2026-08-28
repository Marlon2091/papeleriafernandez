const AppError = require('../utils/AppError');
const unidadesModel = require('../models/unidadesMedida.model');

async function listUnidades() {
  return unidadesModel.findAll();
}

async function crearUnidad({ nombre }) {
  if (!nombre) throw new AppError('nombre es obligatorio', 400);

  try {
    const id_unidad = await unidadesModel.insert({ nombre });
    return unidadesModel.findById(id_unidad);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new AppError('Ya existe una unidad de medida con ese nombre', 409);
    }
    throw error;
  }
}

module.exports = { listUnidades, crearUnidad };
