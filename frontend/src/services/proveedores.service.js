import { api } from './api';

export function getProveedores() {
  return api('/proveedores');
}

export function createProveedor(data) {
  return api('/proveedores', { method: 'POST', body: JSON.stringify(data) });
}

export function updateProveedor(id, data) {
  return api(`/proveedores/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function desactivarProveedor(id) {
  return api(`/proveedores/${id}/desactivar`, { method: 'PATCH' });
}

export function activarProveedor(id) {
  return api(`/proveedores/${id}/activar`, { method: 'PATCH' });
}
