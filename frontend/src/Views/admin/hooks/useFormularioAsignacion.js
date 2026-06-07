import { useState } from 'react';
import { DEFAULT_MAX_GUARDIAS } from '../config/asignacionConstants';

const FORM_INICIAL = {
  mes: '',
  anio: new Date().getFullYear(),
  maxGuardiasConsecutivas: DEFAULT_MAX_GUARDIAS,
  equidadFinesSemana: true,
  evitarEspecialidadesCriticas: true,
  observaciones: '',
  especialidadSeleccionada: '',
};

export function useFormularioAsignacion() {
  const [formulario, setFormulario] = useState(FORM_INICIAL);

  const actualizarCampo = (campo, valor) => {
    setFormulario((prev) => ({ ...prev, [campo]: valor }));
  };

  const resetFormulario = () => setFormulario(FORM_INICIAL);

  return { formulario, actualizarCampo, resetFormulario };
}