// src/Views/profesional/components/SolicitudCambio.jsx

import { useState } from "react";
import { apiRequest } from "../../../apiClient";

// Mismos helpers de formato (podrían extraerse a un archivo común)
const DIAS_SEMANA = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

function normalizarFecha(fecha) {
  if (!fecha) return null;
  const dateObj = new Date(fecha);
  if (isNaN(dateObj)) return null;
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

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

const SolicitudCambio = ({
  usuario,
  guardiaSeleccionada,
  onCancelar,
  irAlInicio
}) => {
  const [motivo, setMotivo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setEnviando(true);
      const { response, data } = await apiRequest("/solicitudes", {
        method: "POST",
        body: {
          motivo,
          id_guardia: guardiaSeleccionada.id_guardia,
          id_usuario: usuario.id_usuario,
        },
      });

      console.log(response);
      console.log(data);

      if (!response.ok) {
        setMensaje(data?.error || "No se pudo enviar la solicitud");
        return;
      }

      setMensaje("✅ Solicitud enviada correctamente");
      setMotivo("");

      setTimeout(() => {
        onCancelar();
      }, 1500);
    }catch (error) {
      console.error(error);
      setMensaje(error.message || "Error del servidor");
    } finally {
      setEnviando(false);
    }
  };

  const fechaBonita = formatearFechaBonita(guardiaSeleccionada.fecha);
  const horaInicio = normalizarHora(guardiaSeleccionada.hora_inicio);
  const horaFin = normalizarHora(guardiaSeleccionada.hora_fin);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Solicitar Cambio de Guardia</h1>
        <p className="text-gray-500 mt-2">
          Estás a punto de pedir un reemplazo para la guardia seleccionada.
        </p>
      </div>

      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
        <h2 className="text-lg font-semibold text-blue-800 mb-3">Detalle de la guardia</h2>
        <div className="space-y-1 text-sm text-gray-700">
          <p><span className="font-medium">📅 Fecha:</span> {fechaBonita}</p>
          <p><span className="font-medium">🕒 Horario:</span> {horaInicio} – {horaFin}</p>
          <p><span className="font-medium">🔢 ID Guardia:</span> #{guardiaSeleccionada.id_guardia}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Motivo del cambio
          </label>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            rows="4"
            placeholder="Explicá brevemente por qué necesitás el reemplazo..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        {mensaje && (
          <div
            className={`p-4 rounded-xl text-sm ${
              mensaje.includes("correctamente")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {mensaje}
          </div>
        )}

        <div className="flex flex-wrap gap-4 justify-end pt-2">

          <button
            type="button"
            onClick={irAlInicio}
            className="
              px-5 py-2.5
              rounded-xl
              border border-cyan-300
              text-cyan-700
              hover:bg-cyan-50
              transition-colors
            "
          >
            Ir al Inicio
          </button>


          <button
            type="button"
            onClick={onCancelar}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Volver
          </button>
          <button
            type="submit"
            disabled={enviando || !motivo.trim()}
            className="inline-flex items-center px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {enviando ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Enviando...
              </>
            ) : (
              "Enviar Solicitud"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SolicitudCambio;