// src/Views/profesional/components/GuardiasAsignadas.jsx

import { useState, useEffect } from "react";
import { apiRequest } from "../../../apiClient";
import GuardiasCard from "./GuardiasCard";

/**
 * Componente que obtiene las guardias de un profesional y permite seleccionar una.
 *
 * Props:
 * @param {string} id_usuario         - ID del usuario autenticado.
 * @param {function} onSeleccionarGuardia - Callback que recibe la guardia seleccionada.
 * @param {function} onGuardiasCargadas   - Callback que recibe la lista de guardias (para el padre).
 */
const GuardiasAsignadas = ({
  id_usuario,
  onSeleccionarGuardia,
  onGuardiasCargadas,
  irAlInicio,
}) => {
  const [guardias, setGuardias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [guardiaSeleccionadaId, setGuardiaSeleccionadaId] = useState(null);

  // Efecto para cargar las guardias al montar o cuando cambia el id_usuario
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

        if (onGuardiasCargadas) {
          onGuardiasCargadas(lista);
        }
      } catch (err) {
        console.error(err);
        setError("Error al cargar guardias");
      } finally {
        setCargando(false);
      }
    };

    if (id_usuario) {
      cargarGuardias();
    }
  }, [id_usuario, onGuardiasCargadas]); // Incluimos onGuardiasCargadas en deps por seguridad

  // La guardia completa seleccionada (objeto entero)
  const guardiaSeleccionada =
    guardias.find(
      (g) => Number(g.id_guardia) === Number(guardiaSeleccionadaId)
    ) || null;

  // Renderizado condicional: carga, error o contenido
  if (cargando) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Cargando guardias...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Cabecera de la sección */}
      <header>
        <h1 className="text-3xl font-bold text-gray-800">
          Gestión de Reemplazos
        </h1>
        <p className="text-gray-500 mt-2">
          Selecciona una guardia para solicitar un cambio de turno.
        </p>
      </header>

      {/* Cuadrícula de tarjetas de guardias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {guardias.map((guardia) => {
          const seleccionada =
            Number(guardia.id_guardia) === Number(guardiaSeleccionadaId);

          return (
            <div
              key={guardia.id_guardia}
              onClick={() => setGuardiaSeleccionadaId(guardia.id_guardia)}
              className={`cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                seleccionada ? "ring-2 ring-blue-500 rounded-2xl" : ""
              }`}
            >
              <GuardiasCard guardia={guardia} />
            </div>
          );
        })}
      </div>

      {/* Botón de solicitar cambio (solo habilitado si hay selección) */}
      <div className="flex flex-wrap gap-4 justify-end">

    {/* BOTÓN VOLVER AL INICIO */}
    <button
      type="button"
      onClick={irAlInicio}
      className="
        px-6 py-3
        rounded-xl
        border border-cyan-300
        text-cyan-700
        hover:bg-cyan-50
        transition-colors
      "
    >
      Ir al Inicio
    </button>

    {/* BOTÓN SOLICITAR CAMBIO */}
    <button
      disabled={!guardiaSeleccionada}
      onClick={() => onSeleccionarGuardia(guardiaSeleccionada)}
      className="
        inline-flex items-center
        px-6 py-3
        bg-blue-600
        text-white
        font-semibold
        rounded-xl
        shadow-md
        hover:bg-blue-700
        disabled:bg-gray-300
        disabled:cursor-not-allowed
        transition-colors
      "
    >
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
        />
      </svg>

      Solicitar Cambio
    </button>

  </div>
    </div>
  );
};

export default GuardiasAsignadas;