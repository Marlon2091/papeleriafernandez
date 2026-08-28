import { api } from './api';

export function getCategorias() {
  return api('/categorias');
}

export function createCategoria(data) {
  return api('/categorias', { method: 'POST', body: JSON.stringify(data) });
}

export function updateCategoria(id, data) {
  return api(`/categorias/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function desactivarCategoria(id) {
  return api(`/categorias/${id}/desactivar`, { method: 'PATCH' });
}

export function activarCategoria(id) {
  return api(`/categorias/${id}/activar`, { method: 'PATCH' });
}
