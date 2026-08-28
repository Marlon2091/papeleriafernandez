import { api } from './api';

export function getProductos({ id_categoria, id_proveedor } = {}) {
  const params = new URLSearchParams();
  if (id_categoria) params.set('id_categoria', id_categoria);
  if (id_proveedor) params.set('id_proveedor', id_proveedor);
  const query = params.toString();
  return api(`/productos${query ? `?${query}` : ''}`);
}

export function getProductosBajoStockMinimo() {
  return api('/productos/stock-bajo');
}

export function getProducto(id) {
  return api(`/productos/${id}`);
}

export function createProducto(data) {
  return api('/productos', { method: 'POST', body: JSON.stringify(data) });
}

export function updateProducto(id, data) {
  return api(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function desactivarProducto(id) {
  return api(`/productos/${id}/desactivar`, { method: 'PATCH' });
}

export function activarProducto(id) {
  return api(`/productos/${id}/activar`, { method: 'PATCH' });
}
