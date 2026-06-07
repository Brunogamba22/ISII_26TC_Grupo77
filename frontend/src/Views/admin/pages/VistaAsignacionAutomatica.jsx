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
    cargando,
    generar,
  } = useAsignacionAutomatica();

  const { especialidades, cargando: cargandoCat } = useEspecialidades();

  const handleSubmit = (e) => {
    e.preventDefault();
    const confirmado = window.confirm('¿Desea generar automáticamente las guardias?');
    if (confirmado) generar();
  };

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Asignación Automática</h1>
        <p className="text-gray-500 mt-1">
          Genera cronogramas de guardias de forma equitativa y automática desde la base de datos.
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

        <CronogramaGenerado turnos={turnosGenerados} />
      </div>
    </div>
  );
}
