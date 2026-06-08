import { useState } from 'react';
import { asignacionService } from '../services/asignacionService';
import { ANIO_MINIMO } from '../config/asignacionConstants';
import { useFormularioAsignacion } from './useFormularioAsignacion';

export function useAsignacionAutomatica() {
  const { formulario, actualizarCampo } = useFormularioAsignacion();

  const [feedback, setFeedback] = useState({
    tipo: null,
    texto: '',
  });

  const [turnosGenerados, setTurnosGenerados] = useState([]);
  const [turnosPendientes, setTurnosPendientes] = useState([]);
  const [cargando, setCargando] = useState(false);

  const validar = () => {
    const { mes, anio, especialidadSeleccionada } = formulario;

    if (!mes || !anio || !especialidadSeleccionada) {
      return {
        ok: false,
        texto: 'Debe completar mes, año y especialidad.',
      };
    }

    if (anio < ANIO_MINIMO) {
      return {
        ok: false,
        texto: 'El año debe ser válido.',
      };
    }

    return { ok: true };
  };

  const construirReglas = (reglas) => ({
    maxGuardiasConsecutivas:
      reglas.maxGuardiasConsecutivas,

    equidadFinesSemana:
      reglas.equidadFinesSemana,

    evitarEspecialidadesCriticas:
      reglas.evitarEspecialidadesCriticas,

    observaciones:
      reglas.observaciones,
  });

  const previsualizar = async () => {
    setFeedback({
      tipo: null,
      texto: '',
    });

    const validacion = validar();

    if (!validacion.ok) {
      setFeedback({
        tipo: 'error',
        texto: validacion.texto,
      });

      return;
    }

    setTurnosPendientes([]);
    setTurnosGenerados([]);
    setCargando(true);

    try {
      const {
        mes,
        anio,
        especialidadSeleccionada,
        horaInicio, 
        horaFin,
        ...reglas
      } = formulario;

      const response =
        await asignacionService.previsualizar({
          mes,
          anio,
          id_especialidad: Number(
            especialidadSeleccionada
          ),
          horaInicio,
          horaFin,
          reglas: construirReglas(reglas),
        });

      if (!response.response.ok) {
        setFeedback({
          tipo: 'error',
          texto:
            response.data?.error ||
            'Error al generar la previsualización.',
        });

        return;
      }

      setTurnosPendientes(
        response.data?.turnos || []
      );

      setFeedback({
        tipo: 'success',
        texto:
          'Previsualización generada correctamente.',
      });

    } catch (error) {
      console.error(error);

      setFeedback({
        tipo: 'error',
        texto:
          'Error de conexión con el servidor.',
      });

    } finally {
      setCargando(false);
    }
  };

  const confirmarCronograma = async () => {

    if (turnosPendientes.length === 0) {

      setFeedback({
        tipo: 'error',
        texto:
          'Debe generar una previsualización antes de confirmar.',
      });

      return;
    }

    setCargando(true);

    try {
      const {
        mes,
        anio,
        especialidadSeleccionada,
        horaInicio,
        horaFin,
        ...reglas
      } = formulario;

      const response =
        await asignacionService.confirmar({
          mes,
          anio,
          id_especialidad: Number(
            especialidadSeleccionada
          ),
          horaInicio,
          horaFin,
          reglas: construirReglas(reglas),
          turnos: turnosPendientes,
        });

      if (!response.response.ok) {

        setFeedback({
          tipo: 'error',
          texto:
            response.data?.error ||
            'Error al guardar el cronograma.',
        });

        return;
      }

      setTurnosGenerados(
        turnosPendientes
      );

      setTurnosPendientes([]);

      setFeedback({
        tipo: 'success',
        texto:
          'Cronograma guardado correctamente.',
      });

    } catch (error) {

      console.error(error);

      setFeedback({
        tipo: 'error',
        texto:
          'Error de conexión con el servidor.',
      });

    } finally {

      setCargando(false);

    }
  };

  return {
    formulario,
    actualizarCampo,

    feedback,
    cargando,

    turnosPendientes,
    turnosGenerados,

    previsualizar,
    confirmarCronograma,
  };
}