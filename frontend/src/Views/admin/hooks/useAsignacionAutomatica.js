import { useState } from 'react';
import { asignacionService } from '../services/asignacionService';

export function useAsignacionAutomatica() {
  const [mes, setMes] = useState('');
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [maxGuardiasConsecutivas, setMaxGuardiasConsecutivas] = useState(3);
  const [equidadFinesSemana, setEquidadFinesSemana] = useState(true);
  const [evitarEspecialidadesCriticas, setEvitarEspecialidadesCriticas] = useState(true);
  const [observaciones, setObservaciones] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [turnosGenerados, setTurnosGenerados] = useState([]);
  const [cargando, setCargando] = useState(false);

  const handleGenerar = async () => {
    setMensaje('');

    if (!mes || !anio) {
      setMensaje('❌ Debe completar mes y año.');
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
      const configuracion = await asignacionService.configurar({
        mes,
        anio,
        reglasEquidad: {
          maxGuardiasConsecutivas,
          equidadFinesSemana,
          evitarEspecialidadesCriticas,
          observaciones,
        },
      });

      if (!configuracion.response.ok) {
        setMensaje(configuracion.data?.error || '❌ Error configurando parámetros.');
        return;
      }

      const id_calendario = configuracion.data.id_calendario;
      const diasDelMes = new Date(anio, mes, 0).getDate();

      const generacion = await asignacionService.generar({
        id_calendario,
        diasDelMes,
        id_especialidad: 1,
        anio,
        mes,
      });

      if (!generacion.response.ok) {
        setMensaje(generacion.data?.error || '❌ Error generando guardias.');
        return;
      }

      setMensaje('✅ Guardias generadas correctamente.');
      setTurnosGenerados(generacion.data.turnos || []);
    } catch (error) {
      console.error(error);
      setMensaje('❌ Error de conexión con el servidor.');
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
    mensaje,
    turnosGenerados,
    cargando,
    handleGenerar,
  };
}
