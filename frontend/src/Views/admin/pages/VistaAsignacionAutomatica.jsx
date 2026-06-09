import { useAsignacionAutomatica } from '../hooks/useAsignacionAutomatica';
import { useEspecialidades } from '../hooks/useEspecialidades';
import FormularioAsignacion from '../components/FormularioAsignacion';
import CronogramaGenerado from '../components/CronogramaGenerado';

export default function VistaAsignacionAutomatica() {

  const {
    formulario,
    actualizarCampo,
    feedback,
    turnosGenerados,
    turnosPendientes,
    cargando,
    previsualizar,
    confirmarCronograma,
    rechazarCronograma,
  } = useAsignacionAutomatica();

  const {
    especialidades,
    cargando: cargandoCat
  } = useEspecialidades();

  const handleSubmit = (e) => {
    e.preventDefault();
    previsualizar();
  };

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Asignación Automática
        </h1>

        <p className="text-gray-500 mt-1">
          Genera cronogramas de guardias de forma equitativa y automática.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <FormularioAsignacion
          formulario={formulario}
          actualizarCampo={actualizarCampo}
          especialidades={especialidades}
          cargandoCat={cargandoCat}
          cargando={cargando}
          feedback={feedback}
          onSubmit={handleSubmit}
        />

        <CronogramaGenerado
          turnos={
            turnosPendientes.length > 0
              ? turnosPendientes
              : turnosGenerados
          }
          esPrevisualizacion={
            turnosPendientes.length > 0
          }
          onConfirmar={
            confirmarCronograma
          }
          onRechazar={
            rechazarCronograma
          }
        />

      </div>

    </div>
  );
}