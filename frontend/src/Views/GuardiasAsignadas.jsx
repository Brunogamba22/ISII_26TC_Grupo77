import { useState, useEffect } from "react";
import { apiRequest } from "../apiClient";
import {
  formatFechaYYYYMMDDToDDMMYYYY,
  formatHorarioHHMMToHHMM,
} from "../utils/formatters";

/**
 * Componente GuardiasAsignadas
 * Trazabilidad: Caso de Uso "Consultar Guardias Asignadas" (<<include>> de Solicitar Cambio)
 * Referencia: Tabla 7 del documento del proyecto.
 * 
 * @param {Object} usuario - Datos del profesional autenticado.
 * @param {Function} onSeleccionarGuardia - Callback cuando elige una guardia.
 */
const GuardiasAsignadas = ({ usuario, onSeleccionarGuardia, onGuardiasCargadas }) => {
  // Lista de guardias asignadas retornadas por el backend para el usuario autenticado.
  const [guardias, setGuardias] = useState([]);

  // Flag de carga para mostrar feedback mientras se consulta la API.
  const [cargando, setCargando] = useState(true);

  // Mensaje de error de negocio o de conectividad para mostrar al usuario.
  const [error, setError] = useState("");

  // ID de la guardia seleccionada en la lista (control de UI y habilitación del botón).
  const [guardiaSeleccionadaId, setGuardiaSeleccionadaId] = useState(null);

  useEffect(() => {
    // Efecto: sincroniza el estado de la vista con el backend cada vez que cambia el usuario autenticado.
    const cargarGuardias = async () => {
      try {
        setError("");
        setCargando(true);

        const id_usuario = usuario?.id_usuario;
        if (!id_usuario) {
          setError("❌ No hay usuario autenticado.");
          setCargando(false);
          return;
        }

        const { response, data } = await apiRequest(`/guardias/${id_usuario}`);

        if (response.status === 404) {
          setGuardias([]);
          setError(data?.mensaje || "No hay guardias asignadas");
          setCargando(false);
          return;
        }

        if (!response.ok) {
          setError(data?.error || data?.mensaje || "No se pudieron cargar las guardias asignadas.");
          setCargando(false);
          return;
        }

        const lista = Array.isArray(data?.guardias) ? data.guardias : [];
        setGuardias(lista);
        // Eleva las guardias al componente padre para reutilizarlas (evita doble fetch).
        onGuardiasCargadas?.(lista);
        setCargando(false);
      } catch (err) {
        setError("No se pudieron cargar las guardias asignadas.");
        setCargando(false);
      }
    };

    cargarGuardias();
  }, [usuario?.id_usuario, onGuardiasCargadas]);

  // Deriva la guardia seleccionada desde el ID para mantener la UI simple.
  const guardiaSeleccionada = guardias.find(
    (g) => Number(g.id_guardia) === Number(guardiaSeleccionadaId)
  );

  if (cargando) {
    return <div className="container">Cargando guardias asignadas...</div>;
  }

  if (error) {
    return <div className="container error-message">{error}</div>;
  }

  // Curso Alternativo 2.1.1: No hay guardias asignadas
  if (guardias.length === 0) {
    return (
      <div className="container">
        <h2>📅 Mis Guardias</h2>
        <div className="card">
          <p>No hay guardias asignadas en el período actual.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>📋 Mis Guardias Asignadas</h2>
      <p style={{ marginBottom: '1rem' }}>
        Profesional: <strong>{usuario.nombre}</strong>
      </p>
      <p>Seleccione la guardia que desea cambiar:</p>

      <div style={{ margin: '1.5rem 0' }}>
        {guardias.map((guardia) => {
          const seleccionada =
            Number(guardiaSeleccionadaId) === Number(guardia.id_guardia);

          return (
            <div
              key={guardia.id_guardia}
              className={`guardia-item ${seleccionada ? "seleccionada" : ""}`}
              onClick={() => setGuardiaSeleccionadaId(guardia.id_guardia)}
            >
              <div>
                <strong>{formatFechaYYYYMMDDToDDMMYYYY(guardia.fecha)}</strong>{" "}
                · {formatHorarioHHMMToHHMM(guardia.horario)}
                <br />
                <span className="badge">ID Guardia: {guardia.id_guardia}</span>
              </div>
              <div style={{ fontSize: "1.5rem" }}>
                {seleccionada ? "✅" : "⏺️"}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          onClick={() => onSeleccionarGuardia(null)}
          style={{ backgroundColor: "#64748b", marginTop: "0" }}
        >
          Volver
        </button>
        <button
          disabled={!guardiaSeleccionada}
          onClick={() => onSeleccionarGuardia(guardiaSeleccionada)}
          style={{ marginTop: "0" }}
        >
          Solicitar Cambio de Guardia
        </button>
      </div>
    </div>
  );
};

export default GuardiasAsignadas;