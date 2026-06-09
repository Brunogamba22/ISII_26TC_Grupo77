// src/Views/profesional/pages/VistaGuardias.jsx
import { useState, useMemo } from "react";
import GuardiasAsignadas from "../components/GuardiasAsignadas";
import SolicitudCambio from "../components/SolicitudCambio";

/**
 * Página principal del flujo "Gestión de Reemplazos".
 * 
 * Props:
 * @param {function} setVistaActiva - Función para cambiar la vista activa en el panel profesional.
 *                                     Normalmente proviene de ProfesionalPanel.
 */
function VistaGuardias({ setVistaActiva }) {
  const usuario = useMemo(
    () => ({
      id_usuario: localStorage.getItem("id_usuario"),
      nombre: localStorage.getItem("nombre"),
      rol: localStorage.getItem("rol"),
    }),
    []
  );

  const [guardias, setGuardias] = useState([]);
  const [guardiaSeleccionada, setGuardiaSeleccionada] = useState(null);

  // Función para volver al inicio: usa el setter global
  const irAlInicio = () => {
    if (setVistaActiva) {
      setVistaActiva("inicio"); // Ajustá este string si tu vista se llama diferente
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {!guardiaSeleccionada ? (
          <GuardiasAsignadas
            id_usuario={usuario.id_usuario}
            onSeleccionarGuardia={setGuardiaSeleccionada}
            onGuardiasCargadas={setGuardias}
            irAlInicio={irAlInicio}   //  Se pasa la función
          />
        ) : (
          <SolicitudCambio
            usuario={usuario}
            guardiaSeleccionada={guardiaSeleccionada}
            guardias={guardias}
            onCancelar={() => setGuardiaSeleccionada(null)}
            irAlInicio={irAlInicio}   // Se pasa la función
          />
        )}
      </div>
    </div>
  );
}

export default VistaGuardias;