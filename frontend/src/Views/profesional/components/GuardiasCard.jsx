// src/Views/profesional/components/GuardiasCard.jsx

const DIAS_SEMANA = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

/**
 * Convierte cualquier representación de fecha (string ISO, string YYYY-MM-DD, Date) a "YYYY-MM-DD".
 * Si no es una fecha válida, retorna null.
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
 * Convierte cualquier representación de hora (string HH:MM:SS, string ISO, Date) a "HH:MM".
 * Si no se puede, retorna "".
 */
function normalizarHora(hora) {
  if (!hora) return "";
  const dateObj = new Date(hora);
  if (!isNaN(dateObj)) {
    const hh = String(dateObj.getHours()).padStart(2, "0");
    const mm = String(dateObj.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }
  // Si no es un date válido, intentamos como string HH:MM:SS
  if (typeof hora === "string" && hora.includes(":")) {
    return hora.substring(0, 5);
  }
  return "";
}

/**
 * Formatea una fecha YYYY-MM-DD a "DíaSemana D de Mes de Año".
 * Ejemplo: "Viernes 6 de Junio de 2026"
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

function GuardiasCard({ guardia }) {
  const fechaBonita = formatearFechaBonita(guardia.fecha);
  const horaInicio = normalizarHora(guardia.hora_inicio);
  const horaFin = normalizarHora(guardia.hora_fin);
  const rangoHorario = horaInicio && horaFin ? `${horaInicio} – ${horaFin}` : "Horario no disponible";

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Fecha */}
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <p className="text-2xl font-bold text-blue-600">{fechaBonita}</p>
          <p className="text-sm text-gray-500 mt-1">
            Guardia #{guardia.id_guardia}
          </p>
        </div>
        <span className="text-2xl opacity-40">🏥</span>
      </div>

      {/* Horario */}
      <div className="flex items-center space-x-2 text-gray-700 mb-3">
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-medium">{rangoHorario}</span>
      </div>

      {guardia.especialidad && (
        <p className="text-sm text-gray-600 mt-1">
          {guardia.especialidad} — {guardia.hospital}
        </p>
      )}
    </div>
  );
}

export default GuardiasCard;