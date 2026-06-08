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
      <div className={`${styles[type]} rounded-xl shadow-lg p-3 min-w-[240px] flex items-center gap-2 text-sm`}>
        <span className="text-xl">{icons[type]}</span>
        <p className="font-medium flex-1">{message}</p>
        <button onClick={onClose} className="hover:opacity-70 text-lg leading-none">
          ✕
        </button>
      </div>
    </div>
  );
};

// ============================================================
// COMPONENTE DE BÚSQUEDA COMPACTO CON LIMPIEZA CORTA
// ============================================================
const SearchBar = ({ searchType, onSearchTypeChange, searchTerm, onSearchChange, onClear }) => {
  return (
    <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-200 transition-all w-full md:w-auto">
      {/* Selector de tipo de búsqueda */}
      <select
        value={searchType}
        onChange={(e) => onSearchTypeChange(e.target.value)}
        className="pl-3 pr-1 py-2 text-sm bg-transparent border-r border-gray-200 focus:outline-none text-gray-600"
      >
        <option value="all">📌 Todo</option>
        <option value="id">🔢 ID</option>
        <option value="fecha">📅 Fecha</option>
      </select>

      {/* Input de búsqueda */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={
          searchType === "id" 
            ? "Ej: 123" 
            : searchType === "fecha" 
            ? "Ej: 15/06/2026" 
            : "ID o fecha..."
        }
        className="flex-1 px-2 py-2 text-sm bg-transparent focus:outline-none min-w-[160px]"
      />

      {/* Botón limpiar CORTO - solo ícono */}
      {searchTerm && (
        <button
          onClick={onClear}
          className="w-6 h-6 mr-1 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          title="Limpiar"
        >
          ✕
        </button>
      )}

      {/* Icono de búsqueda */}
      <div className="px-2 text-gray-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
const GuardiasAsignadas = ({
  id_usuario,
  onSeleccionarGuardia,
  onGuardiasCargadas,
  irAlInicio,
}) => {
  // ============================================================
  // ESTADOS
  // ============================================================
  const [guardias, setGuardias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [filtroActivo, setFiltroActivo] = useState("asignadas");
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("all");

  // ============================================================
  // EFECTO: Cargar guardias
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
        if (onGuardiasCargadas) onGuardiasCargadas(lista);
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
  // FUNCIÓN: Cancelar solicitud
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
      
      setGuardias((prev) =>
        prev.map((g) =>
          g.id_guardia === id_guardia ? { ...g, estado: "asignada", motivo: null } : g
        )
      );
      
      setToast({
        message: " Solicitud cancelada",
        type: "success"
      });
      
    } catch (err) {
      console.error(err);
      setToast({
        message: " Error al cancelar",
        type: "error"
      });
    }
  };

  // ============================================================
  // FUNCIÓN PARA FORMATEAR FECHA
  // ============================================================
  const formatearFechaParaBusqueda = (fechaStr) => {
    if (!fechaStr) return "";
    const date = new Date(fechaStr);
    if (isNaN(date)) return "";
    
    const dias = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    
    const diaSemana = dias[date.getDay()];
    const dia = date.getDate();
    const mes = meses[date.getMonth()];
    const año = date.getFullYear();
    
    const diaFormateado = dia.toString().padStart(2, '0');
    const mesFormateado = (date.getMonth() + 1).toString().padStart(2, '0');
    
    return {
      legible: `${diaSemana} ${dia} de ${mes} de ${año}`.toLowerCase(),
      formatoDMY: `${diaFormateado}/${mesFormateado}/${año}`,
      formatoYMD: fechaStr
    };
  };

  // ============================================================
  // FILTRADO DE GUARDIAS
  // ============================================================
  const guardiasPorEstado = guardias.filter((g) => {
    if (filtroActivo === "pendientes") return g.estado === "pendiente";
    return g.estado !== "pendiente";
  });

  const guardiasFiltradas = guardiasPorEstado.filter((g) => {
    if (!searchTerm.trim()) return true;
    
    const term = searchTerm.toLowerCase().trim();
    const fechaFormateada = formatearFechaParaBusqueda(g.fecha);
    
    switch(searchType) {
      case "id":
        return g.id_guardia.toString().includes(term);
      case "fecha":
        return fechaFormateada.formatoDMY.includes(term) || 
               fechaFormateada.legible.includes(term);
      default:
        return g.id_guardia.toString().includes(term) || 
               fechaFormateada.formatoDMY.includes(term) ||
               fechaFormateada.legible.includes(term);
    }
  });

  const totalAsignadas = guardias.filter((g) => g.estado !== "pendiente").length;
  const totalPendientes = guardias.filter((g) => g.estado === "pendiente").length;

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // ============================================================
  // RENDERIZADO CONDICIONAL
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
    <div className="space-y-6">
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
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Reemplazos</h1>
        <p className="text-gray-500 text-sm mt-1">
          Selecciona una guardia para solicitar un cambio de turno
        </p>
      </div>

      {/* BARRA DE HERRAMIENTAS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* PESTAÑAS - MÁS GRANDES */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => {
              setFiltroActivo("asignadas");
              handleClearSearch();
            }}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              filtroActivo === "asignadas"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-gray-600 hover:bg-white/60 hover:text-blue-600"
            }`}
          >
            🟢 Guardias Actuales ({totalAsignadas})
          </button>

          <button
            onClick={() => {
              setFiltroActivo("pendientes");
              handleClearSearch();
            }}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              filtroActivo === "pendientes"
                ? "bg-white text-yellow-700 shadow-sm"
                : "text-gray-600 hover:bg-white/60 hover:text-yellow-600"
            }`}
          >
            🟡 Solicitudes Pendientes ({totalPendientes})
          </button>
        </div>

        {/* BUSCADOR - MÁS ANCHO */}
        <div className="flex-1 max-w-md">
          <SearchBar
            searchType={searchType}
            onSearchTypeChange={setSearchType}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onClear={handleClearSearch}
          />
        </div>
      </div>

      

      {/* GRID DE TARJETAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guardiasFiltradas.length === 0 ? (
          <div className="col-span-full flex flex-col items-center py-12 text-gray-400">
            <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-3-3v6m-7 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">
              {searchTerm
                ? `No hay coincidencias para "${searchTerm}"`
                : filtroActivo === "asignadas"
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

      {/* BOTÓN VOLVER AL INICIO */}
      <div className="flex justify-end">
        <button
          onClick={irAlInicio}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-cyan-300 text-cyan-700 hover:bg-cyan-50 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Inicio
        </button>
      </div>

      {/* ESTILOS */}
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