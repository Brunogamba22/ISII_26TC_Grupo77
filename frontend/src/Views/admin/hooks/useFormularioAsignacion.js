import { useState } from 'react';
import { DEFAULT_MAX_GUARDIAS } from '../config/asignacionConstants';

const FORM_INICIAL = {
  mes: '',
  anio: new Date().getFullYear(),
  maxGuardiasConsecutivas: DEFAULT_MAX_GUARDIAS,
  equidadFinesSemana: true,
  especialidadSeleccionada: '',
  horaInicio: '08:00', // Valor por defecto
  horaFin: '20:00'     // Valor por defecto
};

export function useFormularioAsignacion() {
  const [formulario, setFormulario] = useState(FORM_INICIAL);

  const actualizarCampo = (campo, valor) => {
    setFormulario((prev) => ({ ...prev, [campo]: valor }));
  };

  const resetFormulario = () => setFormulario(FORM_INICIAL);

  return { formulario, actualizarCampo, resetFormulario };
}