import { api } from './api';

export function getUnidadesMedida() {
  return api('/unidades-medida');
}

export function createUnidadMedida(data) {
  return api('/unidades-medida', { method: 'POST', body: JSON.stringify(data) });
}
