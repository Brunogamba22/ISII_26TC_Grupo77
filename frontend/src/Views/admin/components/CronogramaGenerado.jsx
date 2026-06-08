import {
  CheckCircle,
  AlertTriangle,
  Printer,
  User,
  Clock,
  Calendar,
  Save
} from 'lucide-react';

function turnoKey(turno, index) {
  return turno.id_turno ??
    `${turno.dia}-${turno.id_usuario ?? index}`;
}

export default function CronogramaGenerado({
  turnos = [],
  esPrevisualizacion = false,
  onConfirmar,
  onExportar = () => window.print(),
}) {

  if (turnos.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">

      <div className="flex items-start justify-between gap-4 mb-6">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-cyan-50 flex items-center justify-center">
            {
              esPrevisualizacion
                ? (
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                )
                : (
                  <CheckCircle className="w-6 h-6 text-cyan-600" />
                )
            }
          </div>

          <div>

            <h2 className="text-lg font-semibold text-gray-800">
              {
                esPrevisualizacion
                  ? 'Previsualización del Cronograma'
                  : 'Cronograma Generado'
              }
            </h2>

            <p className="text-sm text-gray-500">
              Total de guardias:
              {' '}
              <span className="font-semibold text-gray-700">
                {turnos.length}
              </span>
            </p>

          </div>

        </div>

        <button
          type="button"
          onClick={onExportar}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          <Printer className="w-4 h-4" />
          Exportar
        </button>

      </div>

      {esPrevisualizacion && (

        <div className="mb-6 p-4 rounded-xl border border-amber-200 bg-amber-50">

          <div className="flex items-start gap-3">

            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />

            <div>

              <p className="font-semibold text-amber-800">
                Borrador sin guardar
              </p>

              <p className="text-sm text-amber-700">
                Este cronograma aún no fue persistido en la base de datos.
                Revíselo cuidadosamente antes de confirmar.
              </p>

            </div>

          </div>

        </div>

      )}

      <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">

        {turnos.map((turno, index) => (
          
          <div
            key={turnoKey(turno, index)}
            
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors"
          >

            <div className="flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-cyan-50">

              <Calendar className="w-4 h-4 text-cyan-600 mb-0.5" />

              <span className="text-xs font-semibold text-cyan-700">
                Día {turno.dia}
              </span>

            </div>

            <div className="flex-1 min-w-0">

              <div className="flex items-center gap-2 text-gray-800 font-medium">

                <User className="w-4 h-4 text-gray-400" />

                <span className="truncate">
                  {turno.nombreCompleto ||
                    `Médico ID: ${turno.id_usuario}`}
                </span>

              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">

                <Clock className="w-4 h-4" />

                <span>
                  {turno.hora_inicio && turno.hora_fin 
                      ? `${turno.hora_inicio.substring(0, 5)} - ${turno.hora_fin.substring(0, 5)}`
                      : (turno.horario || '08:00 - 20:00')}
                </span>

              </div>

            </div>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">

              <CheckCircle className="w-3.5 h-3.5" />

              {turno.estado || 'Asignada'}

            </span>

          </div>

        ))}

      </div>

      {esPrevisualizacion && (

        <div className="mt-6">

          <button
            type="button"
            onClick={onConfirmar}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-4 rounded-xl transition-colors"
          >
            <Save className="w-5 h-5" />
            Confirmar y Guardar Cronograma
          </button>

        </div>

      )}

    </div>
  );
}