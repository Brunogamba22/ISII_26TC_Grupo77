import { apiRequest } from '../../../apiClient';

export const asignacionService = {
  // Mantenim aquests mètodes per si algun dia vols usar-los per separat
  configurar: async (body) => {
    return await apiRequest('/asignacion/configurar', { method: 'POST', body });
  },

  generar: async (body) => {
    return await apiRequest('/asignacion/generar', { method: 'POST', body });
  },

  ejecutarAsignacionCompleta: async ({ mes, anio, id_especialidad, reglas }) => {
    try {
      // 1. Configuracion
      const resConfig = await apiRequest('/asignacion/configurar', {
        method: 'POST',
        body: { mes, anio, reglasEquidad: reglas }
      });

      if (!resConfig.response.ok) {
        return { ok: false, error: resConfig.data?.error || 'Error al configurar los parametros.' };
      }

      // 2. Generacion
      const id_calendario = resConfig.data.id_calendario;
      const diasDelMes = new Date(anio, Number(mes), 0).getDate();

      const resGenerar = await apiRequest('/asignacion/generar', {
        method: 'POST',
        body: { 
          id_calendario, 
          diasDelMes, 
          id_especialidad: Number(id_especialidad), 
          anio, 
          mes: Number(mes) 
        }
      });

      return resGenerar.response.ok 
        ? { ok: true, turnos: resGenerar.data.turnos || [] } 
        : { ok: false, error: resGenerar.data?.error || 'Error al generar las guardias.' };

    } catch (err) {
      console.error("Error en el orquetador de asignacion", err);
      return { ok: false, error: 'Error de comunicacion con el serivdor.' };
    }
  }
};