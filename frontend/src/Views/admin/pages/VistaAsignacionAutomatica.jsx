import {
  Settings,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Printer,
  Loader2,
  Clock,
  User,
  Scale,
} from 'lucide-react';
import { useAsignacionAutomatica } from '../hooks/useAsignacionAutomatica';
import { useCatalogos } from '../hooks/useCatalogos';

const MESES = [
  { numero: "1", nombre: "Enero" },
  { numero: "2", nombre: "Febrero" },
  { numero: "3", nombre: "Marzo" },
  { numero: "4", nombre: "Abril" },
  { numero: "5", nombre: "Mayo" },
  { numero: "6", nombre: "Junio" },
  { numero: "7", nombre: "Julio" },
  { numero: "8", nombre: "Agosto" },
  { numero: "9", nombre: "Septiembre" },
  { numero: "10", nombre: "Octubre" },
  { numero: "11", nombre: "Noviembre" },
  { numero: "12", nombre: "Diciembre" },
];

export default function VistaAsignacionAutomatica() {
  // 🛠️ Conectamos tu hook de negocio real
  const {
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
  } = useAsignacionAutomatica();

  // 🛠️ Conectamos tu hook de catálogos relacionales de MySQL
  const { especialidades, cargando: cargandoCat } = useCatalogos();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleGenerar();
  };

  // Dinamismo de la UI basado en las respuestas reales del servidor
  const hasError = mensaje && !mensaje.startsWith('✅');
  const showResultados = turnosGenerados.length > 0;

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Encabezado de la página al estilo v0 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Asignación Automática</h1>
        <p className="text-gray-500 mt-1">
          Genera cronogramas de guardias de forma equitativa y automática desde la base de datos.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* ============================================================= */}
        {/* BLOQUE 1: CONFIGURACIÓN DE PARÁMETROS (Look de v0) */}
        {/* ============================================================= */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-cyan-50 flex items-center justify-center">
              <Settings className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Asignación Automática de Guardias
              </h2>
              <p className="text-sm text-gray-500">Configura los parámetros base</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Fila 1: Mes, Año, Especialidad */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Mes */}
              <div className="space-y-2">
                <label htmlFor="mes" className="block text-sm font-medium text-gray-700">
                  Mes
                </label>
                <select
                  id="mes"
                  value={mes}
                  onChange={(e) => setMes(e.target.value)}
                  disabled={cargando}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all disabled:opacity-50"
                >
                  <option value="">Seleccione mes</option>
                  {MESES.map((m) => (
                    <option key={m.numero} value={m.numero}>{m.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Año */}
              <div className="space-y-2">
                <label htmlFor="anio" className="block text-sm font-medium text-gray-700">
                  Año
                </label>
                <input
                  id="anio"
                  type="number"
                  value={anio}
                  onChange={(e) => setAnio(Number(e.target.value))}
                  disabled={cargando}
                  min="2025"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>

              {/* Especialidad DINÁMICA de la Base de Datos */}
              <div className="space-y-2">
                <label htmlFor="especialidad" className="block text-sm font-medium text-gray-700">
                  Especialidad
                </label>
                <select
                  id="especialidad"
                  value={especialidadSeleccionada}
                  onChange={(e) => setEspecialidadSeleccionada(e.target.value)}
                  disabled={cargando}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all disabled:opacity-50"
                >
                  <option value="">{cargandoCat ? 'Cargando...' : 'Seleccione'}</option>
                  {especialidades.map((esp) => (
                    <option key={esp.id_especialidad} value={esp.id_especialidad}>
                      {esp.descripcion}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sección: Reglas Equitativas */}
            <div className="pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Scale className="w-5 h-5 text-cyan-600" />
                <h3 className="text-base font-semibold text-gray-800">Reglas Equitativas</h3>
              </div>

              <div className="space-y-4">
                {/* Máximo de guardias consecutivas */}
                <div className="space-y-2">
                  <label htmlFor="maxConsecutivas" className="block text-sm font-medium text-gray-700">
                    Máximo de guardias consecutivas
                  </label>
                  <input
                    id="maxConsecutivas"
                    type="number"
                    value={maxGuardiasConsecutivas}
                    onChange={(e) => setMaxGuardiasConsecutivas(Number(e.target.value))}
                    disabled={cargando}
                    min="1"
                    max="10"
                    className="w-full sm:w-40 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all disabled:opacity-50"
                  />
                </div>

                {/* Checkbox Fines de Semana */}
                <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={equidadFinesSemana}
                    onChange={() => setEquidadFinesSemana(!equidadFinesSemana)}
                    disabled={cargando}
                    className="mt-0.5 w-5 h-5 rounded border-gray-300 text-cyan-600 focus:ring-2 focus:ring-cyan-500 cursor-pointer accent-cyan-600"
                  />
                  <div>
                    <span className="block text-sm font-medium text-gray-800">
                      Distribuir equitativamente fines de semana
                    </span>
                    <span className="block text-xs text-gray-500 mt-0.5">
                      Reparte los turnos de sábado y domingo de forma balanceada.
                    </span>
                  </div>
                </label>

                {/* Checkbox Especialidades Críticas */}
                <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={evitarEspecialidadesCriticas}
                    onChange={() => setEvitarEspecialidadesCriticas(!evitarEspecialidadesCriticas)}
                    disabled={cargando}
                    className="mt-0.5 w-5 h-5 rounded border-gray-300 text-cyan-600 focus:ring-2 focus:ring-cyan-500 cursor-pointer accent-cyan-600"
                  />
                  <div>
                    <span className="block text-sm font-medium text-gray-800">
                      Evitar colisiones con especialidades críticas
                    </span>
                    <span className="block text-xs text-gray-500 mt-0.5">
                      Previene solapamientos con áreas de alta demanda.
                    </span>
                  </div>
                </label>

                {/* Observaciones */}
                <div className="space-y-2">
                  <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700">
                    Observaciones
                  </label>
                  <textarea
                    id="observaciones"
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    disabled={cargando}
                    rows={3}
                    placeholder="Notas o consideraciones especiales para esta asignación..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Botón dinámico con loader animado */}
            <button
              type="submit"
              disabled={cargando}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-sm shadow-cyan-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {cargando ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generando asignación...
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5" />
                  Generar Asignación Automática
                </>
              )}
            </button>

            {/* Feedback de Éxito */}
            {mensaje && !hasError && (
              <div className="flex items-start gap-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm font-medium">
                {mensaje}
              </div>
            )}

            {/* Alertas de Error del Backend */}
            {hasError && (
              <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-700">
                    Asignación Fallida
                  </p>
                  <p className="text-sm text-red-600 mt-0.5">
                    {mensaje}
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* ============================================================= */}
        {/* BLOQUE 2: CRONOGRAMA REAL MAPEADO DESDE MYSQL */}
        {/* ============================================================= */}
        {showResultados && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-cyan-50 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Cronograma Generado</h2>
                  <p className="text-sm text-gray-500">
                    Total de guardias generadas:{' '}
                    <span className="font-semibold text-gray-700">{turnosGenerados.length}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex-shrink-0"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Exportar</span>
              </button>
            </div>

            {/* Lista interactiva */}
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {turnosGenerados.map((turno, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-cyan-50 flex-shrink-0">
                    <Calendar className="w-4 h-4 text-cyan-600 mb-0.5" />
                    <span className="text-xs font-semibold text-cyan-700">Día {turno.dia}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-gray-800 font-medium">
                      <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{turno.nombreCompleto || `Médico ID: ${turno.id_usuario}`}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{turno.horario || '08:00 a 20:00'}</span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium flex-shrink-0">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {turno.estado || 'Asignada'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}