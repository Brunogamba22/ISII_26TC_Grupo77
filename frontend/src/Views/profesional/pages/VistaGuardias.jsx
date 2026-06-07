// src/Views/profesional/pages/VistaGuardias.jsx

import { useState, useMemo } from "react";
import GuardiasAsignadas from "../components/GuardiasAsignadas";
import SolicitudCambio from "../components/SolicitudCambio";

/**
 * Página principal del flujo "Gestión de Reemplazos".
 *
 * Estados locales:
 * - guardias: lista de guardias obtenidas del backend (compartida entre los componentes).
 * - guardiaSeleccionada: guardia elegida para solicitar el cambio.
 *
 * La navegación entre componentes se controla con el valor de guardiaSeleccionada.
 */
function VistaGuardias() {
  // Datos del usuario desde localStorage (estabilizados con useMemo para no cambiar referencia)
  const usuario = useMemo(() => ({
    id_usuario: localStorage.getItem("id_usuario"),
    nombre: localStorage.getItem("nombre"),
    rol: localStorage.getItem("rol"),
  }), []);

  const [guardias, setGuardias] = useState([]);
  const [guardiaSeleccionada, setGuardiaSeleccionada] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Transición entre lista de guardias y formulario de solicitud */}
        {!guardiaSeleccionada ? (
          <GuardiasAsignadas
            id_usuario={usuario.id_usuario}
            onSeleccionarGuardia={setGuardiaSeleccionada}
            onGuardiasCargadas={setGuardias}
          />
        ) : (
          <SolicitudCambio
            usuario={usuario}
            guardiaSeleccionada={guardiaSeleccionada}
            guardias={guardias}
            onCancelar={() => setGuardiaSeleccionada(null)}
          />
        )}
      </div>
    </div>
  );
}

export default VistaGuardias;