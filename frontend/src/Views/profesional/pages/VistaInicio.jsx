// Path: src/Views/profesional/pages/VistaReemplazos.jsx

import { useState } from "react";

import GuardiasAsignadas from "../components/GuardiasAsignadas";
import SolicitudCambio from "../components/SolicitudCambio";

/**
 * VistaReemplazos
 *
 * Responsabilidad:
 * Orquestar el flujo completo del Caso de Uso:
 * "Solicitar Cambio de Guardia".
 *
 * Mantiene desacoplados:
 * - selección de guardias
 * - formulario de solicitud
 *
 * Esto mejora:
 * - cohesión
 * - reutilización
 * - mantenibilidad
 * - trazabilidad con documentación
 */
function VistaReemplazos() {

  /**
   * Usuario autenticado.
   * Actualmente se obtiene desde localStorage
   * para mantener compatibilidad con Login existente.
   */
  const usuario = {
    id_usuario: localStorage.getItem("id_usuario"),
    nombre: localStorage.getItem("nombre"),
    rol: localStorage.getItem("rol"),
  };

  /**
   * Lista de guardias recuperadas desde backend.
   * Se comparte entre componentes para evitar doble fetch.
   */
  const [guardias, setGuardias] = useState([]);

  /**
   * Guardia seleccionada para solicitar reemplazo.
   */
  const [guardiaSeleccionada, setGuardiaSeleccionada] = useState(null);

  /**
   * Si existe una guardia seleccionada:
   * mostramos formulario de solicitud.
   *
   * Caso contrario:
   * mostramos listado de guardias.
   */
  return (
    <div className="space-y-6">

      {!guardiaSeleccionada ? (
        <GuardiasAsignadas
          usuario={usuario}
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
  );
}

export default VistaReemplazos;