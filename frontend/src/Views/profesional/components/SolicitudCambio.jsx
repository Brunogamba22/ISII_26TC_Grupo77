// src/Views/profesional/components/SolicitudCambio.jsx

import { useState } from "react";
import { apiRequest } from "../../../apiClient";

// ============================================================
// HELPERS DE FORMATEO
// ============================================================
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

// ============================================================
// COMPONENTE DE VALIDACIÓN EN TIEMPO REAL
// ============================================================
const ValidacionMotivo = ({ motivo }) => {
  const errores = [];
  
  if (!motivo || motivo.trim().length === 0) {
    errores.push("El motivo es obligatorio");
  } else {
    const motivoTrimmed = motivo.trim();
    const longitud = motivoTrimmed.length;
    
    if (longitud < 10) {
      errores.push(`Mínimo 10 caracteres (actual: ${longitud})`);
    }
    
    if (longitud > 150) {
      errores.push(`Máximo 150 caracteres (actual: ${longitud})`);
    }
    
    if (/^\d+$/.test(motivoTrimmed)) {
      errores.push("No puede ser solo números");
    }
    
    const palabras = motivoTrimmed.split(/\s+/).filter(p => p.length > 0);
    if (palabras.length < 3) {
      errores.push(`Describe con al menos 3 palabras (actual: ${palabras.length})`);
    }
    
    if (/[<>{}]/.test(motivoTrimmed)) {
      errores.push("Caracteres no permitidos: < > { }");
    }
  }
  
  if (errores.length === 0 && motivo && motivo.trim().length > 0) {
    return (
      <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
        <span>✅</span>
        <span>Motivo válido</span>
      </div>
    );
  }
  
  if (errores.length > 0 && motivo && motivo.trim().length > 0) {
    return (
      <div className="mt-2 space-y-1">
        {errores.map((error, idx) => (
          <div key={idx} className="text-xs text-yellow-600 flex items-center gap-1">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        ))}
      </div>
    );
  }
  
  return null;
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
const SolicitudCambio = ({
  usuario,
  guardiaSeleccionada,
  onCancelar,
  irAlInicio
}) => {
  // Estados internos
  const [motivo, setMotivo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [touched, setTouched] = useState(false);

  // Validar si el motivo es válido
  const esMotivoValido = () => {
    if (!motivo || motivo.trim().length === 0) return false;
    const motivoTrimmed = motivo.trim();
    if (motivoTrimmed.length < 10) return false;
    if (motivoTrimmed.length > 150) return false;
    if (/^\d+$/.test(motivoTrimmed)) return false;
    const palabras = motivoTrimmed.split(/\s+/).filter(p => p.length > 0);
    if (palabras.length < 3) return false;
    if (/[<>{}]/.test(motivoTrimmed)) return false;
    return true;
  };

  // ============================================================
  // MANEJAR ENVÍO DEL FORMULARIO
  // ============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    
    // Validación local antes de enviar
    if (!esMotivoValido()) {
      setMensaje("⚠️ Por favor, corrija los errores del motivo antes de enviar");
      return;
    }
    
    try {
      setEnviando(true);
      setMensaje("");
      
      const { response, data } = await apiRequest("/solicitudes", {
        method: "POST",
        body: {
          motivo: motivo.trim(),
          id_guardia: guardiaSeleccionada.id_guardia,
          id_usuario: usuario.id_usuario,
        },
      });

      console.log(response);
      console.log(data);

      if (!response.ok) {
        // Manejo detallado de errores del backend
        if (data.details && data.details.errors) {
          setMensaje(`❌ ${data.error}\n\n${data.details.errors.join("\n")}`);
        } else if (data.suggestion) {
          setMensaje(`❌ ${data.error}\n\n💡 ${data.suggestion}`);
        } else {
          setMensaje(`❌ ${data.error || "No se pudo enviar la solicitud"}`);
        }
        return;
      }

      setMensaje(" Solicitud enviada correctamente");
      setMotivo("");
      setTouched(false);

      setTimeout(() => {
        onCancelar();
      }, 1500);
      
    } catch (error) {
      console.error(error);
      setMensaje(" Error de conexión con el servidor");
    } finally {
      setEnviando(false);
    }
  };

  // Formateo de datos de la guardia seleccionada
  const fechaBonita = formatearFechaBonita(guardiaSeleccionada.fecha);
  const horaInicio = normalizarHora(guardiaSeleccionada.hora_inicio);
  const horaFin = normalizarHora(guardiaSeleccionada.hora_fin);

  // ============================================================
  // VISTA PRINCIPAL
  // ============================================================
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* CABECERA */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Solicitar Cambio de Guardia</h1>
        <p className="text-gray-500 mt-2">
          Estás a punto de pedir un reemplazo para la guardia seleccionada.
        </p>
      </div>

      {/* DETALLE DE LA GUARDIA */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
        <h2 className="text-lg font-semibold text-blue-800 mb-3">Detalle de la guardia</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <p className="flex items-center gap-2">
            <span className="text-blue-500">📅</span>
            <span className="font-medium">Fecha:</span> {fechaBonita}
          </p>
          <p className="flex items-center gap-2">
            <span className="text-blue-500">🕒</span>
            <span className="font-medium">Horario:</span> {horaInicio} – {horaFin}
          </p>
          <p className="flex items-center gap-2">
            <span className="text-blue-500">🔢</span>
            <span className="font-medium">ID Guardia:</span> #{guardiaSeleccionada.id_guardia}
          </p>
        </div>
      </div>

      {/* FORMULARIO DE SOLICITUD */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Motivo del cambio
            <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            value={motivo}
            onChange={(e) => {
              setMotivo(e.target.value);
              setTouched(false);
            }}
            onBlur={() => setTouched(true)}
            rows="4"
            placeholder="Ejemplo: Problemas personales, necesito viajar por emergencia familiar..."
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none ${
              touched && !esMotivoValido() && motivo.trim().length > 0
                ? "border-yellow-400 bg-yellow-50"
                : touched && motivo.trim().length === 0
                ? "border-red-300 bg-red-50"
                : "border-gray-200"
            }`}
          />
          
          {/* Contador de caracteres */}
          <div className="mt-1 flex justify-between items-center">
            <ValidacionMotivo motivo={motivo} />
            <span className={`text-xs ${motivo.length > 150 ? "text-red-500" : "text-gray-400"}`}>
              {motivo.length}/150
            </span>
          </div>
          
          {/* Sugerencia de ejemplo */}
          {(!motivo || motivo.trim().length === 0) && (
            <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
              <span>💡</span>
              <span>Ej: "Problemas de salud familiar, necesito ausentarme ese día"</span>
            </div>
          )}
        </div>

        {/* MENSAJE DE RESPUESTA - Estilo mejorado */}
        {mensaje && (
          <div
            className={`p-4 rounded-xl text-sm flex items-start gap-2 animate-slide-down ${
              mensaje.includes("✅")
                ? "bg-green-50 text-green-700 border border-green-200"
                : mensaje.includes("⚠️")
                ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            <span className="text-xl mt-0.5">
              {mensaje.includes("✅") ? "✅" : mensaje.includes("⚠️") ? "⚠️" : "❌"}
            </span>
            <div className="flex-1 whitespace-pre-line">{mensaje}</div>
            <button onClick={() => setMensaje("")} className="hover:opacity-70 text-lg leading-none">
              ✕
            </button>
          </div>
        )}

        {/* BOTONES DE ACCIÓN */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          {/* Botón Enviar Solicitud */}
          <button
            type="submit"
            disabled={enviando || !motivo.trim() || (touched && !esMotivoValido())}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            {enviando ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Enviando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Enviar Solicitud
              </>
            )}
          </button>

          {/* Botón Volver */}
          <button
            type="button"
            onClick={onCancelar}
            className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver
          </button>

          {/* Botón Ir al Inicio */}
          <button
            type="button"
            onClick={irAlInicio}
            className="px-5 py-3 rounded-xl border border-cyan-300 text-cyan-700 hover:bg-cyan-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Ir al Inicio
          </button>
        </div>
      </form>
    </div>
  );
};

export default SolicitudCambio;