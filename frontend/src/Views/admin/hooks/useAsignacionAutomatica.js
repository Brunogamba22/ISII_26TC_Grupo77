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

  const handleGenerar = async (datosConfig) => { // Recibe el objeto con mes, anio, etc.
    setCargando(true);
    setMensaje('');
    try {
      // 1. Configurar
      const configRes = await asignacionService.configurar(datosConfig);
      if (!configRes.response.ok) throw new Error(configRes.data?.error || 'Error configurando.');

      // 2. Generar
      const genRes = await asignacionService.generar({
        id_calendario: configRes.data.id_calendario,
        diasDelMes: new Date(datosConfig.anio, datosConfig.mes, 0).getDate(),
        id_especialidad: 1,
        anio: datosConfig.anio,
        mes: datosConfig.mes
      });

      if (!genRes.response.ok) throw new Error(genRes.data?.error || 'Error generando.');
      
      setTurnosGenerados(genRes.data.turnos || []);
      setMensaje('✅ Guardias generadas correctamente.');
    } catch (err) {
      setMensaje(err.message);
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
