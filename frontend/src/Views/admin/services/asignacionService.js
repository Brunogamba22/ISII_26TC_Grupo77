import { apiRequest } from '../../../apiClient';

export const asignacionService = {

  previsualizar: async (payload) => {

    const response =
      await apiRequest(
        '/asignacion/previsualizar',
        {
          method: 'POST',
          body: payload
        }
      );

    return response;
  },

  confirmar: async (payload) => {

    const response =
      await apiRequest(
        '/asignacion/confirmar',
        {
          method: 'POST',
          body: payload
        }
      );

    return response;
  }
};