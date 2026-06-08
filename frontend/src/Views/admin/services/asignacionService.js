import { apiRequest } from '../../../apiClient';

export const asignacionService = {

  ejecutarAsignacionCompleta: async ({
    mes,
    anio,
    id_especialidad,
    reglas
  }) => {

    try {

      const response =
        await apiRequest(
          '/asignacion/ejecutar',
          {
            method: 'POST',
            body: {
              mes,
              anio,
              id_especialidad,
              reglas
            }
          }
        );

      if (!response.response.ok) {

        return {
          ok: false,
          error:
            response.data?.error ||
            'Error al generar las guardias.'
        };
      }

      return {
        ok: true,
        turnos:
          response.data?.turnos || []
      };

    } catch (error) {

      console.error(
        'Error en asignacionService:',
        error
      );

      return {
        ok: false,
        error:
          'Error de comunicación con el servidor.'
      };
    }
  }
};