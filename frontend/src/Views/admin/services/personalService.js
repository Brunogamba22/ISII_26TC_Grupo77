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
  },

  // Edita un profesional existente
  editar: async (id_usuario, datosProfesional) => {
    return await apiRequest(`/personal/${id_usuario}`, {
      method: 'PUT',
      body: datosProfesional
    });
  },

  // Elimina un profesional (baja lógica)
  eliminar: async (id_usuario) => {
    return await apiRequest(`/personal/${id_usuario}`, {
      method: 'DELETE'
    });
  }
};