import { useMemo } from 'react';
import { Settings, Scale, Loader2, Calendar } from 'lucide-react';
import { obtenerOpcionesMeses } from '../../../utils/dateUtils';
import { ANIO_MINIMO } from '../config/asignacionConstants';
import FeedbackAsignacion from './FeedbackAsignacion';

const inputClass =
  'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all disabled:opacity-50';

export default function FormularioAsignacion({
  formulario,
  actualizarCampo,
  especialidades = [],
  cargandoCat = false,
  cargando = false,
  feedback,
  onSubmit,
}) {
  const opcionesMeses = useMemo(() => obtenerOpcionesMeses(), []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-cyan-50 flex items-center justify-center">
          <Settings className="w-6 h-6 text-cyan-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Asignación Automática de Guardias</h2>
          <p className="text-sm text-gray-500">Configura los parámetros base</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <div className="space-y-2">
      <label htmlFor="mes" className="block text-sm font-medium text-gray-700">Mes</label>
      <select id="mes" value={formulario.mes} onChange={(e) => actualizarCampo('mes', e.target.value)} disabled={cargando} className={inputClass}>
        <option value="">Seleccione mes</option>
        {opcionesMeses.map((m) => (<option key={m.numero} value={m.numero}>{m.nombre}</option>))}
      </select>
    </div>

    <div className="space-y-2">
      <label htmlFor="anio" className="block text-sm font-medium text-gray-700">Año</label>
      <input id="anio" type="number" value={formulario.anio} onChange={(e) => actualizarCampo('anio', Number(e.target.value))} disabled={cargando} min={ANIO_MINIMO} className={inputClass} />
    </div>

    <div className="space-y-2">
      <label htmlFor="especialidad" className="block text-sm font-medium text-gray-700">Especialidad</label>
      <select id="especialidad" value={formulario.especialidadSeleccionada} onChange={(e) => actualizarCampo('especialidadSeleccionada', e.target.value)} disabled={cargando} className={inputClass}>
        <option value="">{cargandoCat ? 'Cargando...' : 'Seleccione'}</option>
        {especialidades.map((esp) => (<option key={esp.id_especialidad} value={esp.id_especialidad}>{esp.descripcion}</option>))}
      </select>
    </div>
  </div>

  {/* Bloque de Horarios (Ahora alineado con el ancho total del formulario) */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Hora Inicio</label>
      <input
        type="time"
        value={formulario.horaInicio}
        onChange={(e) => actualizarCampo('horaInicio', e.target.value)}
        disabled={cargando}
        className={inputClass}
      />
    </div>
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Hora Fin</label>
      <input
        type="time"
        value={formulario.horaFin}
        onChange={(e) => actualizarCampo('horaFin', e.target.value)}
        disabled={cargando}
        className={inputClass}
      />
    </div>
  </div>

        <div className="pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Scale className="w-5 h-5 text-cyan-600" />
            <h3 className="text-base font-semibold text-gray-800">Reglas Equitativas</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="maxConsecutivas" className="block text-sm font-medium text-gray-700">
                Máximo de guardias consecutivas
              </label>
              <input
                id="maxConsecutivas"
                type="number"
                value={formulario.maxGuardiasConsecutivas}
                onChange={(e) => actualizarCampo('maxGuardiasConsecutivas', Number(e.target.value))}
                disabled={cargando}
                min="1"
                max="10"
                className={`${inputClass} sm:w-40`}
              />
            </div>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={formulario.equidadFinesSemana}
                onChange={() => actualizarCampo('equidadFinesSemana', !formulario.equidadFinesSemana)}
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

            <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={formulario.evitarEspecialidadesCriticas}
                onChange={() =>
                  actualizarCampo('evitarEspecialidadesCriticas', !formulario.evitarEspecialidadesCriticas)
                }
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

            <div className="space-y-2">
              <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700">
                Observaciones
              </label>
              <textarea
                id="observaciones"
                value={formulario.observaciones}
                onChange={(e) => actualizarCampo('observaciones', e.target.value)}
                disabled={cargando}
                rows={3}
                placeholder="Notas o consideraciones especiales para esta asignación..."
                className={`${inputClass} resize-none placeholder-gray-400`}
              />
            </div>
          </div>
        </div>

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

        <FeedbackAsignacion feedback={feedback} />
      </form>
    </div>
  );
}
