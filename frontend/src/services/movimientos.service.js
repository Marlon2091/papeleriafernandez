import { api } from './api';

export function getMovimientos({ id_producto, desde, hasta } = {}) {
  const params = new URLSearchParams();
  if (id_producto) params.set('id_producto', id_producto);
  if (desde) params.set('desde', desde);
  if (hasta) params.set('hasta', hasta);
  const query = params.toString();
  return api(`/movimientos${query ? `?${query}` : ''}`);
}

export function createMovimiento(data) {
  return api('/movimientos', { method: 'POST', body: JSON.stringify(data) });
}
