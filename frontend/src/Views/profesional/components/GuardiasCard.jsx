// src/Views/profesional/components/GuardiasCard.jsx

// Días y meses en español para formatear fechas
const DIAS_SEMANA = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

/**
 * Convierte cualquier representación de fecha (string ISO, Date) a "YYYY-MM-DD".
 * Retorna null si no es una fecha válida.
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
 * Convierte cualquier representación de hora a "HH:MM".
 * Acepta string "HH:MM:SS" o Date.
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
 * Formatea una fecha legible por humanos:
 * "Viernes 6 de Junio de 2026"
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

/**
 * Tarjeta individual que representa una guardia.
 * Muestra fecha, horario, estado y un botón de acción.
 */
function GuardiasCard({ guardia, onCancelarSolicitud, onSolicitarCambio }) {
  // Formateo de los datos
  const fechaBonita = formatearFechaBonita(guardia.fecha);
  const horaInicio = normalizarHora(guardia.hora_inicio);
  const horaFin = normalizarHora(guardia.hora_fin);
  const rangoHorario = `${horaInicio} – ${horaFin}`;

  // Determina si la guardia tiene una solicitud de cambio pendiente
  const esPendiente = guardia.estado === "pendiente";

  // Estilos dinámicos según el estado
  const estilosCard = esPendiente
    ? "bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200 hover:border-yellow-300"
    : "bg-gradient-to-br from-white to-blue-50/30 border-gray-200 hover:border-blue-300";

  const estilosTitulo = esPendiente ? "text-yellow-700" : "text-blue-700";

  return (
    <div className={`rounded-2xl p-6 border shadow-sm hover:shadow-lg transition-all duration-300 ${estilosCard}`}>
      {/* Encabezado con fecha e ID */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <h2 className={`text-xl font-bold ${estilosTitulo}`}>{fechaBonita}</h2>
          <p className="text-gray-500 text-sm mt-1">Guardia #{guardia.id_guardia}</p>
        </div>
        <span className="text-3xl opacity-20">🏥</span>
      </div>

      {/* Horario con icono */}
      <div className="flex items-center gap-2 text-gray-700 mb-5">
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-medium">{rangoHorario}</span>
      </div>

      {/* Badge de estado: pendiente o asignada */}
      <div className="mb-6">
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

      {/* Botón de acción: solicitar cambio o cancelar solicitud */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Evita que el clic se propague a la tarjeta padre
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