// src/Views/profesional/components/GuardiasCard.jsx

const DIAS_SEMANA = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado"
];

const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre"
];

/**
 * Normaliza fecha.
 */
function normalizarFecha(fecha) {

  if (!fecha) return null;

  const dateObj = new Date(fecha);

  if (isNaN(dateObj)) return null;

  const y = dateObj.getFullYear();

  const m = String(
    dateObj.getMonth() + 1
  ).padStart(2, "0");

  const d = String(
    dateObj.getDate()
  ).padStart(2, "0");

  return `${y}-${m}-${d}`;
}

/**
 * Normaliza hora.
 */
function normalizarHora(hora) {

  if (!hora) return "";

  const dateObj = new Date(hora);

  if (!isNaN(dateObj)) {

    const hh = String(
      dateObj.getHours()
    ).padStart(2, "0");

    const mm = String(
      dateObj.getMinutes()
    ).padStart(2, "0");

    return `${hh}:${mm}`;
  }

  if (
    typeof hora === "string" &&
    hora.includes(":")
  ) {
    return hora.substring(0, 5);
  }

  return "";
}

/**
 * Formato visual bonito.
 */
function formatearFechaBonita(
  fechaStr
) {

  const fecha =
    normalizarFecha(fechaStr);

  if (!fecha) {
    return "Fecha desconocida";
  }

  const [
    year,
    month,
    day
  ] = fecha.split("-");

  const date =
    new Date(year, month - 1, day);

  if (isNaN(date)) {
    return "Fecha inválida";
  }

  const diaSemana =
    DIAS_SEMANA[date.getDay()];

  const mesNombre =
    MESES[date.getMonth()];

  return `
    ${diaSemana}
    ${parseInt(day)}
    de
    ${mesNombre}
    de
    ${year}
  `;
}

/**
 * COMPONENTE CARD
 */
function GuardiasCard({

  guardia,

  onCancelarSolicitud,

  onSolicitarCambio

}) {

  /**
   * Datos visuales.
   */
  const fechaBonita =
    formatearFechaBonita(
      guardia.fecha
    );

  const horaInicio =
    normalizarHora(
      guardia.hora_inicio
    );

  const horaFin =
    normalizarHora(
      guardia.hora_fin
    );

  const rangoHorario =
    `${horaInicio} – ${horaFin}`;

  /**
   * Estado.
   */
  const esPendiente =
    guardia.estado === "pendiente";

  /**
   * Colores dinámicos.
   */
  const estilosCard =
    esPendiente
      ? `
          bg-yellow-50
          border-yellow-300
          hover:border-yellow-400
        `
      : `
          bg-white
          border-gray-200
          hover:border-blue-300
        `;

  const estilosTitulo =
    esPendiente
      ? "text-yellow-700"
      : "text-blue-600";

  return (

    <div
      className={`
        rounded-2xl
        p-6
        border
        shadow-sm
        hover:shadow-lg
        transition-all
        duration-300
        ${estilosCard}
      `}
    >

      {/* HEADER */}
      <div className="flex justify-between mb-5">

        <div>

          <h2
            className={`
              text-2xl
              font-bold
              ${estilosTitulo}
            `}
          >
            {fechaBonita}
          </h2>

          <p className="text-gray-500 mt-1">
            Guardia #{guardia.id_guardia}
          </p>

        </div>

        <div className="text-3xl opacity-30">
          🏥
        </div>

      </div>

      {/* HORARIO */}
      <div
        className="
          flex items-center
          gap-2
          text-gray-700
          mb-5
        "
      >

        <svg
          className="w-5 h-5 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="
              M12 8v4l3 3
              m6-3
              a9 9 0 11-18 0
              9 9 0 0118 0z
            "
          />
        </svg>

        <span className="font-medium">
          {rangoHorario}
        </span>

      </div>

      {/* ESTADO */}
      <div className="mb-6">

        {
          esPendiente ? (

            <div
              className="
                inline-flex
                items-center
                gap-2
                bg-yellow-200
                text-yellow-900
                px-4
                py-2
                rounded-xl
                text-sm
                font-semibold
              "
            >
              ⏳ Solicitud pendiente
            </div>

          ) : (

            <div
              className="
                inline-flex
                items-center
                gap-2
                bg-emerald-100
                text-emerald-700
                px-4
                py-2
                rounded-xl
                text-sm
                font-semibold
              "
            >
              ✅ Guardia asignada
            </div>

          )
        }

      </div>

      {/* ACCIONES */}
      <div>

        {
          esPendiente ? (

            <button
            onClick={(e) => {

              /**
               * Evita que el click
               * llegue a la card padre.
               */
              e.stopPropagation();
            
              onCancelarSolicitud(
                guardia.id_guardia
              );
            }}
              className="
                w-full
                bg-red-500
                hover:bg-red-600
                text-white
                py-3
                rounded-xl
                font-semibold
                transition-colors
              "
            >
              Cancelar Solicitud
            </button>

          ) : (

            <button
            onClick={(e) => {

              /**
               * Evita propagación
               * hacia la card.
               */
              e.stopPropagation();
            
              onSolicitarCambio(
                guardia
              );
            }}
              className="
                w-full
                bg-blue-600
                hover:bg-blue-700
                text-white
                py-3
                rounded-xl
                font-semibold
                transition-colors
              "
            >
              Solicitar Cambio
            </button>

          )
        }

      </div>

    </div>
  );
}

export default GuardiasCard;