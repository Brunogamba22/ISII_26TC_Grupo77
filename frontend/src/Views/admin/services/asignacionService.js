import { apiRequest } from '../../../apiClient';

export const asignacionService = {
  configurar: async (body) => {
    return await apiRequest('/asignacion/configurar', { method: 'POST', body });
  },

  generar: async (body) => {
    return await apiRequest('/asignacion/generar', { method: 'POST', body });
  },
};
