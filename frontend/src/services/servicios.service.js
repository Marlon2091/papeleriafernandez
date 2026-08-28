import { api } from './api';

export function getServicios() {
  return api('/servicios');
}

export function createServicio(data) {
  return api('/servicios', { method: 'POST', body: JSON.stringify(data) });
}

export function updateServicio(id, data) {
  return api(`/servicios/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function desactivarServicio(id) {
  return api(`/servicios/${id}/desactivar`, { method: 'PATCH' });
}

export function activarServicio(id) {
  return api(`/servicios/${id}/activar`, { method: 'PATCH' });
}
