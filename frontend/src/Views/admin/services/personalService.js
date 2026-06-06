import { apiRequest } from '../../../apiClient';

/**
 * Servicio para gestionar la entidad "Personal"
 */
export const personalService = {
  // Obtiene el listado de profesionales
  obtener: async () => {
    return await apiRequest('/personal', { method: 'GET' });
  },

  // Registra un nuevo profesional
  registrar: async (datosProfesional) => {
    return await apiRequest('/registro', { 
      method: 'POST', 
      body: datosProfesional 
    });
  }
};