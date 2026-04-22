import { useState } from "react";
import { apiRequest } from "../apiClient";
import {
  formatFechaYYYYMMDDToDDMMYYYY,
  formatHorarioHHMMToHHMM,
} from "../utils/formatters";

/**
 * Componente SolicitudCambio
 * Trazabilidad: Caso de Uso "Solicitar Cambio de Guardia" (Principal)
 * Contrato de Operación 1: crearSolicitudDeCambio
 * Referencia: Tabla 5, Tabla 11 del documento del proyecto.
 * 
 * @param {Object} usuario - Profesional autenticado.
 * @param {Object} guardiaSeleccionada - Guardia que se desea cambiar (obtenida de GuardiasAsignadas).
 * @param {Function} onCancelar - Función para volver atrás.
 */
const SolicitudCambio = ({ usuario, guardiaSeleccionada, guardias = [], onCancelar }) => {
  const [idGuardiaSeleccionada, setIdGuardiaSeleccionada] = useState(
    guardiaSeleccionada?.id_guardia ? String(guardiaSeleccionada.id_guardia) : ""
  );
  const [motivo, setMotivo] = useState("");
  const [alerta, setAlerta] = useState(null); // { tipo: "success" | "error", texto: string }
  const [enviando, setEnviando] = useState(false);

  const guardiaActual = guardias.find(
    (g) => String(g.id_guardia) === String(idGuardiaSeleccionada)
  );

  // Si no hay guardias disponibles, no debería renderizarse este componente
  if (!Array.isArray(guardias) || guardias.length === 0) {
    return (
      <div className="container error-message">
        No hay guardias disponibles para solicitar cambio.
        <button onClick={onCancelar}>Volver</button>
      </div>
    );
  }

  /**
   * Maneja el envío del formulario de solicitud de cambio.
   * Implementa el curso normal y alternativos de la conversación.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlerta(null);

    if (!guardiaActual) {
      setAlerta({ tipo: "error", texto: "❌ Seleccione una guardia." });
      return;
    }

    if (!motivo.trim()) {
      setAlerta({ tipo: "error", texto: "❌ Ingrese el motivo." });
      return;
    }

    setEnviando(true);

    try {
      const id_usuario = usuario?.id_usuario;
      const id_guardia = guardiaActual?.id_guardia;

      if (!id_usuario || !id_guardia) {
        setAlerta({ tipo: "error", texto: "❌ No se pudo identificar usuario o guardia." });
        return;
      }

      const { response, data } = await apiRequest("/solicitudes", {
        method: "POST",
        body: {
          fecha: guardiaActual.fecha,
          hora: guardiaActual.horario,
          motivo,
          id_guardia,
          id_usuario,
        },
      });

      if (response.status === 400 || response.status === 409) {
        setAlerta({ tipo: "error", texto: data?.error || "❌ No se pudo registrar la solicitud." });
        return;
      }

      if (response.status === 201) {
        // Primero mostramos el éxito, luego limpiamos inputs sin desmontar el componente.
        setAlerta({ tipo: "success", texto: data?.mensaje || "✅ Solicitud registrada correctamente" });
        setMotivo("");
        setIdGuardiaSeleccionada("");
        return;
      }

      setAlerta({ tipo: "error", texto: data?.error || "❌ Error al registrar la solicitud. Intente nuevamente." });
      
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
      setAlerta({ tipo: "error", texto: "❌ Error al registrar la solicitud. Intente nuevamente." });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="container">
      <h2>🔄 Solicitar Cambio de Guardia</h2>
      
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Guardia seleccionada</h3>
        {guardiaActual ? (
          <p>
            <strong>ID Guardia:</strong> {guardiaActual.id_guardia} <br />
            <strong>Fecha:</strong> {guardiaActual.fecha} <br />
            <strong>Horario:</strong> {guardiaActual.horario}
          </p>
        ) : (
          <p>Seleccione una guardia para ver los datos.</p>
        )}
        <p style={{ fontSize: '0.9rem', color: '#475569' }}>
          Solicitante: {usuario.nombre}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="guardia">Guardia *</label>
          <select
            id="guardia"
            value={idGuardiaSeleccionada}
            onChange={(e) => setIdGuardiaSeleccionada(e.target.value)}
            disabled={enviando}
          >
            <option value="">-- Seleccione --</option>
            {guardias.map((g) => (
              <option key={g.id_guardia} value={String(g.id_guardia)}>
                #{g.id_guardia} · {formatFechaYYYYMMDDToDDMMYYYY(g.fecha)} ·{" "}
                {formatHorarioHHMMToHHMM(g.horario)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="motivo">Motivo del cambio *</label>
          <textarea
            id="motivo"
            rows="3"
            placeholder="Ej: Compromiso personal, enfermedad, etc."
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            disabled={enviando}
            maxLength={150}
          />
          <small style={{ color: '#64748b' }}>{motivo.length}/150 caracteres</small>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            type="button" 
            onClick={onCancelar}
            disabled={enviando}
            style={{ backgroundColor: '#94a3b8' }}
          >
            Cancelar
          </button>
          <button type="submit" disabled={enviando}>
            {enviando ? "Enviando solicitud..." : "Confirmar Solicitud"}
          </button>
        </div>

        {/* Contenedor estático para estabilidad del DOM */}
        <div aria-live="polite" style={{ marginTop: "1rem" }}>
          {alerta ? (
            <div className={alerta.tipo === "success" ? "success-message" : "error-message"}>
              {alerta.texto}
            </div>
          ) : (
            <div />
          )}
        </div>
      </form>

      
    </div>
  );
};

export default SolicitudCambio;