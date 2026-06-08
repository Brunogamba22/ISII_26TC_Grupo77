// src/Views/profesional/components/GuardiasAsignadas.jsx

import { useState, useEffect } from "react";
import { apiRequest } from "../../../apiClient";
import GuardiasCard from "./GuardiasCard";

// ============================================================
// COMPONENTE DE NOTIFICACIÓN TOAST
// ============================================================
const ToastNotification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
    warning: "bg-yellow-500 text-white",
  };

  const icons = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
    warning: "⚠️",
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-slide-up">
      <div className={`${styles[type]} rounded-xl shadow-lg p-4 min-w-[280px] flex items-center gap-3`}>
        <span className="text-2xl">{icons[type]}</span>
        <p className="font-medium flex-1">{message}</p>
        <button onClick={onClose} className="hover:opacity-70">
          ✕
        </button>
      </div>
    </div>
  );
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
/**
 * Componente que:
 * - Obtiene las guardias del profesional desde el backend.
 * - Muestra tarjetas con filtro entre "asignadas" y "pendientes".
 * - Permite solicitar cambio o cancelar una solicitud pendiente.
 */
const GuardiasAsignadas = ({
  id_usuario,            // ID del médico logueado
  onSeleccionarGuardia,  // Callback al elegir una guardia para solicitar cambio
  onGuardiasCargadas,    // Callback que notifica al padre la lista completa
  irAlInicio,            // Función para volver a la vista de inicio
}) => {
  // ============================================================
  // ESTADOS
  // ============================================================
  const [guardias, setGuardias] = useState([]);       // Lista completa
  const [cargando, setCargando] = useState(true);    // Control de carga
  const [error, setError] = useState("");            // Mensaje de error
  const [filtroActivo, setFiltroActivo] = useState("asignadas"); // 'asignadas' | 'pendientes'
  const [toast, setToast] = useState(null);          // Estado para notificaciones

  // ============================================================
  // EFECTO: Cargar guardias al montar o cambiar id_usuario
  // ============================================================
  useEffect(() => {
    const cargarGuardias = async () => {
      try {
        setCargando(true);
        setError("");
        const { response, data } = await apiRequest(`/guardias/${id_usuario}`);
        if (!response.ok) {
          setError(data?.mensaje || "No se pudieron cargar las guardias");
          return;
        }
        const lista = data?.guardias || [];
        setGuardias(lista);
        if (onGuardiasCargadas) onGuardiasCargadas(lista); // Notifica al padre
      } catch (err) {
        console.error(err);
        setError("Error al cargar guardias");
      } finally {
        setCargando(false);
      }
    };

    if (id_usuario) cargarGuardias();
  }, [id_usuario, onGuardiasCargadas]);

  // ============================================================
  // FUNCIÓN: Cancelar solicitud pendiente (con notificación mejorada)
  // ============================================================
  const cancelarSolicitud = async (id_guardia) => {
    try {
      if (!window.confirm("¿Desea cancelar la solicitud?")) return;
      
      const { response, data } = await apiRequest(
        `/solicitudes/cancelar/${id_guardia}`,
        { method: "PUT" }
      );
      
      if (!response.ok) {
        setToast({
          message: data?.error || "No se pudo cancelar",
          type: "error"
        });
        return;
      }
      
      // Actualiza el estado local sin recargar toda la lista
      setGuardias((prev) =>
        prev.map((g) =>
          g.id_guardia === id_guardia ? { ...g, estado: "asignada" } : g
        )
      );
      
      // Notificación de éxito
      setToast({
        message: "Solicitud cancelada correctamente",
        type: "success"
      });
      
    } catch (err) {
      console.error(err);
      setToast({
        message: "Error al cancelar solicitud",
        type: "error"
      });
    }
  };

  // ============================================================
  // FILTRADO DE GUARDIAS SEGÚN PESTAÑA ACTIVA
  // ============================================================
  const guardiasFiltradas = guardias.filter((g) => {
    if (filtroActivo === "pendientes") return g.estado === "pendiente";
    return g.estado !== "pendiente";
  });

  // Contadores para mostrar en los botones
  const totalAsignadas = guardias.filter((g) => g.estado !== "pendiente").length;
  const totalPendientes = guardias.filter((g) => g.estado === "pendiente").length;

  // ============================================================
  // RENDERIZADO CONDICIONAL: Carga / Error
  // ============================================================
  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600" />
        <span className="mt-4 text-gray-500">Cargando guardias...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3">
        <span className="text-xl">⚠️</span>
        {error}
      </div>
    );
  }

  // ============================================================
  // VISTA PRINCIPAL
  // ============================================================
  return (
    <div className="space-y-8">
      {/* NOTIFICACIÓN TOAST */}
      {toast && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* CABECERA */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Reemplazos</h1>
        <p className="text-gray-500 mt-2">
          Selecciona una guardia para solicitar un cambio de turno.
        </p>
      </div>

      {/* SELECTOR DE VISTA (PESTAÑAS) */}
      <div className="flex gap-2 bg-gray-100 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setFiltroActivo("asignadas")}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            filtroActivo === "asignadas"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-gray-600 hover:bg-white/60 hover:text-blue-600"
          }`}
        >
          🟢 Guardias Actuales ({totalAsignadas})
        </button>

        <button
          onClick={() => setFiltroActivo("pendientes")}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            filtroActivo === "pendientes"
              ? "bg-white text-yellow-700 shadow-sm"
              : "text-gray-600 hover:bg-white/60 hover:text-yellow-600"
          }`}
        >
          🟡 Solicitudes Pendientes ({totalPendientes})
        </button>
      </div>

      {/* GRID DE TARJETAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {guardiasFiltradas.length === 0 ? (
          // Mensaje cuando no hay elementos
          <div className="col-span-full flex flex-col items-center py-16 text-gray-400">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-3-3v6m-7 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-lg">
              {filtroActivo === "asignadas"
                ? "No hay guardias asignadas"
                : "No hay solicitudes pendientes"}
            </p>
          </div>
        ) : (
          guardiasFiltradas.map((guardia) => (
            <div
              key={guardia.id_guardia}
              className="transition-transform duration-200 hover:scale-[1.01]"
            >
              <GuardiasCard
                guardia={guardia}
                onSolicitarCambio={onSeleccionarGuardia}
                onCancelarSolicitud={cancelarSolicitud}
              />
            </div>
          ))
        )}
      </div>

      {/* BOTÓN PARA VOLVER AL INICIO */}
      <div className="flex justify-end">
        <button
          onClick={irAlInicio}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-cyan-300 text-cyan-700 hover:bg-cyan-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Ir al Inicio
        </button>
      </div>











      {/* ESTILOS ADICIONALES PARA LA ANIMACIÓN DEL TOAST */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default GuardiasAsignadas;