import { apiRequest } from '../../../apiClient';

export const catalogosService = {
  obtenerEspecialidades: async () => {
    try {
      const { response, data } = await apiRequest('/especialidades', { method: 'GET' });
      if (response.ok) return data?.especialidades ?? [];
    } catch (error) {
      console.error("Error al obtener especialidades:", error);
    }
    return [];
  },

  obtenerRoles: async () => {
    try {
      const { response, data } = await apiRequest('/roles', { method: 'GET' });
      if (response.ok) return data?.roles ?? [];
    } catch (error) {
      console.error("Error al obtener roles:", error);
    }
    return [];
  },
};
