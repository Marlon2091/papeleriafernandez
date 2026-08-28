const AppError = require('../utils/AppError');
const proveedoresModel = require('../models/proveedores.model');

async function listProveedores() {
  return proveedoresModel.findAll();
}

async function getProveedorById(id) {
  const proveedor = await proveedoresModel.findById(id);
  if (!proveedor) throw new AppError('Proveedor no encontrado', 404);
  return proveedor;
}

async function crearProveedor({ nombre, contacto, telefono, email, direccion }) {
  if (!nombre) throw new AppError('nombre es obligatorio', 400);

  const id_proveedor = await proveedoresModel.insert({ nombre, contacto, telefono, email, direccion });
  return getProveedorById(id_proveedor);
}

async function actualizarProveedor(id, { nombre, contacto, telefono, email, direccion }) {
  if (!nombre) throw new AppError('nombre es obligatorio', 400);
  await getProveedorById(id);

  await proveedoresModel.update(id, { nombre, contacto, telefono, email, direccion });
  return getProveedorById(id);
}

async function cambiarEstadoProveedor(id, activo) {
  const ok = await proveedoresModel.setActivo(id, activo);
  if (!ok) throw new AppError('Proveedor no encontrado', 404);
}

module.exports = {
  listProveedores,
  getProveedorById,
  crearProveedor,
  actualizarProveedor,
  cambiarEstadoProveedor
};
