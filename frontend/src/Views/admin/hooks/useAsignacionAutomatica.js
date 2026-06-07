import { useState } from 'react';
import { asignacionService } from '../services/asignacionService';

export function useAsignacionAutomatica() {
  const [mes, setMes] = useState('');
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [maxGuardiasConsecutivas, setMaxGuardiasConsecutivas] = useState(3);
  const [equidadFinesSemana, setEquidadFinesSemana] = useState(true);
  const [evitarEspecialidadesCriticas, setEvitarEspecialidadesCriticas] = useState(true);
  const [observaciones, setObservaciones] = useState('');
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState('');

  const [mensaje, setMensaje] = useState('');
  const [turnosGenerados, setTurnosGenerados] = useState([]);
  const [cargando, setCargando] = useState(false);

  const handleGenerar = async () => {
    setMensaje('');

    if (!mes || !anio || !especialidadSeleccionada) {
      setMensaje('❌ Debe completar mes, año y especialidad.');
      return;
    }

    if (anio < 2025) {
      setMensaje('❌ El año debe ser válido.');
      return;
    }

    const confirmado = window.confirm('¿Desea generar automáticamente las guardias?');
    if (!confirmado) return;

    setCargando(true);
    setTurnosGenerados([]);

    try {
      // ==========================================
      // PASO 1 -> CONFIGURAR PARAMETROS EN LA BD
      // ==========================================
      const resConfig = await asignacionService.configurar({
        mes,
        anio,
        reglasEquidad: {
          maxGuardiasConsecutivas,
          equidadFinesSemana,
          evitarEspecialidadesCriticas,
          observaciones,
        },
      });

      if (!resConfig.response.ok) {
        throw new Error(resConfig.data?.error || '❌ Error configurando parámetros.');
      }

      const id_calendario = resConfig.data.id_calendario;
      const diasDelMes = new Date(anio, Number(mes), 0).getDate();

      // ==========================================
      // PASO 2 -> EJECUTAR EL MOTOR DE ASIGNACIÓN
      // ==========================================
      const resGenerar = await asignacionService.generar({
        id_calendario,
        diasDelMes,
        id_especialidad: Number(especialidadSeleccionada),
        anio,
        mes: Number(mes)
      });

      if (!resGenerar.response.ok) {
        throw new Error(resGenerar.data?.error || '❌ Error generando guardias.');
      }

      // ÉXITO TOTAL
      setMensaje('✅ Guardias generadas correctamente.');
      setTurnosGenerados(resGenerar.data.turnos || []);

    } catch (error) {
      console.error(error);
      setMensaje(error.message || '❌ Error de conexión con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  return {
    mes, setMes,
    anio, setAnio,
    maxGuardiasConsecutivas, setMaxGuardiasConsecutivas,
    equidadFinesSemana, setEquidadFinesSemana,
    evitarEspecialidadesCriticas, setEvitarEspecialidadesCriticas,
    observaciones, setObservaciones,
    especialidadSeleccionada, setEspecialidadSeleccionada,
    mensaje,
    turnosGenerados,
    cargando,
    handleGenerar,
  };
}