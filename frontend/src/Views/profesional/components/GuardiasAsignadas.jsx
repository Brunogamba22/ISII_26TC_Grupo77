// src/Views/profesional/components/GuardiasAsignadas.jsx

import { useState, useEffect } from "react";
import { apiRequest } from "../../../apiClient";
import GuardiasCard from "./GuardiasCard";

/**
 * Componente que obtiene las guardias del profesional y permite:
 * - Visualizar guardias actuales y solicitudes pendientes.
 * - Solicitar cambio de guardia.
 * - Cancelar solicitudes pendientes.
 *
 * Props:
 * @param {string} id_usuario          - ID del profesional autenticado.
 * @param {function} onSeleccionarGuardia - Callback que recibe la guardia para solicitar cambio.
 * @param {function} onGuardiasCargadas   - Callback que notifica al padre la lista completa.
 * @param {function} irAlInicio           - Función para volver a la vista de inicio.
 */
const GuardiasAsignadas = ({
  id_usuario,
  onSeleccionarGuardia,
  onGuardiasCargadas,
  irAlInicio,
}) => {
  // Estado: lista completa de guardias (asignadas y pendientes)
  const [guardias, setGuardias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Nuevo estado para el filtro activo: 'asignadas' | 'pendientes'
  const [filtroActivo, setFiltroActivo] = useState("asignadas");

  // Carga inicial de guardias (sin cambios)
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
  }, [id_usuario, onGuardiasCargadas]);

  /**
   * Cancelar una solicitud pendiente (sin cambios en la lógica)
   */
  const cancelarSolicitud = async (id_guardia) => {
    try {
      const confirmar = window.confirm("¿Desea cancelar la solicitud?");
      if (!confirmar) return;

      const { response, data } = await apiRequest(
        `/solicitudes/cancelar/${id_guardia}`,
        { method: "PUT" }
      );

      if (!response.ok) {
        alert(data?.error || "No se pudo cancelar");
        return;
      }

      // Actualización local optimista
      const nuevasGuardias = guardias.map((guardia) => {
        if (Number(guardia.id_guardia) === Number(id_guardia)) {
          return { ...guardia, estado: "asignada" };
        }
        return guardia;
      });

      setGuardias(nuevasGuardias);
      alert("Solicitud cancelada correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al cancelar solicitud");
    }
  };

  // Filtrado según la pestaña activa
  const guardiasFiltradas = guardias.filter((g) => {
    if (filtroActivo === "pendientes") return g.estado === "pendiente";
    if (filtroActivo === "asignadas") return g.estado !== "pendiente"; // incluye "asignada" o cualquier otro estado que no sea pendiente
    return true; // por si se agrega una opción "todas" en el futuro
  });

  // Cantidad de cada tipo para mostrar en las pestañas
  const totalAsignadas = guardias.filter((g) => g.estado !== "pendiente").length;
  const totalPendientes = guardias.filter((g) => g.estado === "pendiente").length;

  // Renderizado condicional: carga o error
  if (cargando) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
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
      {/* CABECERA */}
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Reemplazos</h1>
        <p className="text-gray-500 mt-2">
          Selecciona una guardia para solicitar un cambio de turno.
        </p>
      </header>

      {/* SELECTOR DE VISTA (PESTAÑAS) */}
      <div className="flex gap-2 bg-gray-100 p-1.5 rounded-2xl w-fit">
        {/* Pestaña: Guardias Actuales */}
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

        {/* Pestaña: Solicitudes Pendientes */}
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

      {/* GRID DE CARDS FILTRADAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {guardiasFiltradas.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            {filtroActivo === "asignadas"
              ? "No tienes guardias asignadas actualmente."
              : "No tienes solicitudes pendientes."}
          </div>
        ) : (
          guardiasFiltradas.map((guardia) => (
            <div
              key={guardia.id_guardia}
              className="cursor-pointer transition-all duration-200 transform hover:scale-[1.02]"
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

      {/* BOTONES INFERIORES */}
      <div className="flex flex-wrap gap-4 justify-end">
        <button
          type="button"
          onClick={irAlInicio}
          className="px-6 py-3 rounded-xl border border-cyan-300 text-cyan-700 hover:bg-cyan-50 transition-colors"
        >
          Ir al Inicio
        </button>
      </div>
    </div>
  );
};

export default GuardiasAsignadas;