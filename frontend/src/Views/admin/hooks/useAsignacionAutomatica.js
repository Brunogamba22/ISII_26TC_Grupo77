import { useState } from 'react';
import { asignacionService } from '../services/asignacionService';
import { ANIO_MINIMO } from '../config/asignacionConstants';
import { useFormularioAsignacion } from './useFormularioAsignacion';

export function useAsignacionAutomatica() {
  const { formulario, actualizarCampo } = useFormularioAsignacion();

  const [feedback, setFeedback] = useState({ tipo: null, texto: '' });
  const [turnosGenerados, setTurnosGenerados] = useState([]);
  const [cargando, setCargando] = useState(false);

  const validar = () => {
    const { mes, anio, especialidadSeleccionada } = formulario;

    if (!mes || !anio || !especialidadSeleccionada) {
      return { ok: false, texto: 'Debe completar mes, año y especialidad.' };
    }
    if (anio < ANIO_MINIMO) {
      return { ok: false, texto: 'El año debe ser válido.' };
    }
    return { ok: true };
  };

  const generar = async () => {
    const confirmado = window.confirm(
      '¿Desea generar automáticamente las guardias?'
    );
  
    if (!confirmado) {
      return;
    }
  
    setFeedback({ tipo: null, texto: '' });
  
    const validacion = validar();
    if (!validacion.ok) {
      setFeedback({ tipo: 'error', texto: validacion.texto });
      return;
    }
  
    setCargando(true);
    setTurnosGenerados([]);
  
    try {
      const { mes, anio, especialidadSeleccionada, ...reglas } = formulario;
  
      const resultado = await asignacionService.ejecutarAsignacionCompleta({
        mes,
        anio,
        id_especialidad: especialidadSeleccionada,
        reglas: {
          maxGuardiasConsecutivas: reglas.maxGuardiasConsecutivas,
          equidadFinesSemana: reglas.equidadFinesSemana,
          evitarEspecialidadesCriticas: reglas.evitarEspecialidadesCriticas,
          observaciones: reglas.observaciones,
        },
      });
  
      if (!resultado.ok) {
        setFeedback({ tipo: 'error', texto: resultado.error });
        return;
      }
  
      setFeedback({
        tipo: 'success',
        texto: 'Guardias generadas correctamente.',
      });
  
      setTurnosGenerados(resultado.turnos);
    } catch (error) {
      console.error(error);
  
      setFeedback({
        tipo: 'error',
        texto: 'Error de conexión con el servidor.',
      });
    } finally {
      setCargando(false);
    }
  };

  return {
    formulario,
    actualizarCampo,
    feedback,
    turnosGenerados,
    cargando,
    generar,
  };
}