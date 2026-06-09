// src/Views/profesional/components/GuardiasCard.jsx

// ============================================================
// HELPERS DE FORMATEO DE FECHAS Y HORAS
// ============================================================
const DIAS_SEMANA = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

/**
 * Convierte cualquier fecha a "YYYY-MM-DD"
 */
function normalizarFecha(fecha) {
  if (!fecha) return null;
  const dateObj = new Date(fecha);
  if (isNaN(dateObj)) return null;
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Convierte cualquier hora a "HH:MM"
 */
function normalizarHora(hora) {
  if (!hora) return "";
  const dateObj = new Date(hora);
  if (!isNaN(dateObj)) {
    const hh = String(dateObj.getHours()).padStart(2, "0");
    const mm = String(dateObj.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }
  if (typeof hora === "string" && hora.includes(":")) {
    return hora.substring(0, 5);
  }
  return "";
}

/**
 * Formato legible: "Viernes 6 de Junio de 2026"
 */
function formatearFechaBonita(fechaStr) {
  const fecha = normalizarFecha(fechaStr);
  if (!fecha) return "Fecha desconocida";
  const [year, month, day] = fecha.split("-");
  const date = new Date(year, month - 1, day);
  if (isNaN(date)) return "Fecha inválida";
  const diaSemana = DIAS_SEMANA[date.getDay()];
  const mesNombre = MESES[date.getMonth()];
  return `${diaSemana} ${parseInt(day)} de ${mesNombre} de ${year}`;
}

// ============================================================
// COMPONENTE TARJETA DE GUARDIA
// ============================================================
/**
 * Muestra una guardia individual con:
 * - Fecha formateada
 * - Horario
 * - Estado (asignada o pendiente)
 * - Motivo de la solicitud (si es pendiente)
 * - Botón de acción (solicitar cambio / cancelar solicitud)
 */
function GuardiasCard({ guardia, onCancelarSolicitud, onSolicitarCambio }) {
  // Formateo de datos
  const fechaBonita = formatearFechaBonita(guardia.fecha);
  const horaInicio = normalizarHora(guardia.hora_inicio);
  const horaFin = normalizarHora(guardia.hora_fin);
  const rangoHorario = `${horaInicio} – ${horaFin}`;

  // Determina si la guardia tiene solicitud pendiente
  const esPendiente = guardia.estado === "pendiente";

  // Estilos dinámicos según estado
  const estilosCard = esPendiente
    ? "bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200 hover:border-yellow-300"
    : "bg-gradient-to-br from-white to-blue-50/30 border-gray-200 hover:border-blue-300";

  const estilosTitulo = esPendiente ? "text-yellow-700" : "text-blue-700";

  // ============================================================
  // RENDERIZADO DE LA TARJETA
  // ============================================================
  return (
    <div className={`rounded-2xl p-6 border shadow-sm hover:shadow-lg transition-all duration-300 ${estilosCard}`}>
      {/* Encabezado: fecha e ID */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <h2 className={`text-xl font-bold ${estilosTitulo}`}>{fechaBonita}</h2>
          <p className="text-gray-500 text-sm mt-1">Guardia #{guardia.id_guardia}</p>
        </div>
        <span className="text-3xl opacity-20">🏥</span>
      </div>

      {/* Horario */}
      <div className="flex items-center gap-2 text-gray-700 mb-5">
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-medium">{rangoHorario}</span>
      </div>

      {/* Estado */}
      <div className="mb-4">
        {esPendiente ? (
          <span className="inline-flex items-center gap-1.5 bg-yellow-200 text-yellow-900 px-4 py-1.5 rounded-full text-sm font-semibold">
            ⏳ Solicitud pendiente
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-semibold">
            ✅ Asignada
          </span>
        )}
      </div>

      {/* MOSTRAR MOTIVO si es pendiente y existe */}
      {esPendiente && guardia.motivo && (
        <div className="mb-4 p-3 bg-white/50 rounded-xl border border-yellow-100">
          <p className="text-xs font-semibold text-yellow-700 mb-1 flex items-center gap-1">
            📝 Motivo de la solicitud:
          </p>
          <p className="text-sm text-gray-700 italic">
            "{guardia.motivo}"
          </p>
        </div>
      )}

      {/* Botón de acción */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Evita propagación a contenedores padres
          esPendiente
            ? onCancelarSolicitud(guardia.id_guardia)
            : onSolicitarCambio(guardia);
        }}
        className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
          esPendiente
            ? "bg-red-500 hover:bg-red-600 text-white shadow-sm"
            : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
        }`}
      >
        {esPendiente ? "Cancelar Solicitud" : "Solicitar Cambio"}
      </button>
    </div>
  );
}

export default GuardiasCard;