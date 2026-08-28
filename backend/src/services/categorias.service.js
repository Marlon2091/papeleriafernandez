const AppError = require('../utils/AppError');
const categoriasModel = require('../models/categorias.model');

async function listCategorias() {
  return categoriasModel.findAll();
}

async function getCategoriaById(id) {
  const categoria = await categoriasModel.findById(id);
  if (!categoria) throw new AppError('Categoría no encontrada', 404);
  return categoria;
}

async function crearCategoria({ nombre, descripcion }) {
  if (!nombre) throw new AppError('nombre es obligatorio', 400);

  try {
    const id_categoria = await categoriasModel.insert({ nombre, descripcion });
    return getCategoriaById(id_categoria);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new AppError('Ya existe una categoría con ese nombre', 409);
    }
    throw error;
  }
}

async function actualizarCategoria(id, { nombre, descripcion }) {
  if (!nombre) throw new AppError('nombre es obligatorio', 400);
  await getCategoriaById(id);

  try {
    await categoriasModel.update(id, { nombre, descripcion });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new AppError('Ya existe una categoría con ese nombre', 409);
    }
    throw error;
  }

  return getCategoriaById(id);
}

async function cambiarEstadoCategoria(id, activo) {
  const ok = await categoriasModel.setActivo(id, activo);
  if (!ok) throw new AppError('Categoría no encontrada', 404);
}

module.exports = {
  listCategorias,
  getCategoriaById,
  crearCategoria,
  actualizarCategoria,
  cambiarEstadoCategoria
};
