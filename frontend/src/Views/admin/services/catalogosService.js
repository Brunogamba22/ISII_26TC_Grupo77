import { apiRequest } from '../../../apiClient';

const MOCK_ESPECIALIDADES = [
  { id_especialidad: 1, descripcion: 'Pediatría' },
  { id_especialidad: 2, descripcion: 'Cardiología' },
  { id_especialidad: 3, descripcion: 'Neurología' },
  { id_especialidad: 4, descripcion: 'Traumatología' },
  { id_especialidad: 5, descripcion: 'Medicina General' },
];

const MOCK_ROLES = [
  { id_rol: 1, nombre_rol: 'Administrador' },
  { id_rol: 2, nombre_rol: 'Profesional' },
  { id_rol: 3, nombre_rol: 'Editor' },
];

export const catalogosService = {
  obtenerEspecialidades: async () => {
    try {
      const { response, data } = await apiRequest('/especialidades', { method: 'GET' });
      if (response.ok) return data?.especialidades ?? MOCK_ESPECIALIDADES;
    } catch {
      // fallback a mocks
    }
    return MOCK_ESPECIALIDADES;
  },

  obtenerRoles: async () => {
    try {
      const { response, data } = await apiRequest('/roles', { method: 'GET' });
      if (response.ok) return data?.roles ?? MOCK_ROLES;
    } catch {
      // fallback a mocks
    }
    return MOCK_ROLES;
  },
};
