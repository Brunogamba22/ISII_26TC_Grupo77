import { useState } from "react";

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
const SolicitudCambio = ({ usuario, guardiaSeleccionada, onCancelar }) => {
  const [motivo, setMotivo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Si no hay guardia seleccionada, no debería renderizarse este componente
  if (!guardiaSeleccionada) {
    return (
      <div className="container error-message">
        Error: No se ha seleccionado ninguna guardia.
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
    setMensaje("");

    // Validación: motivo no vacío (Curso Alternativo 6.1.1)
    if (!motivo.trim()) {
      setMensaje("❌ Debe especificar un motivo para la solicitud.");
      return;
    }

    setEnviando(true);

    try {
      // --- CONTRATO crearSolicitudDeCambio ---
      // Parámetros:
      // - solicitante: usuario.id_usuario
      // - id_guardia: guardiaSeleccionada.id_guardia
      // - fecha_hora: (implícita en la guardia, pero puede enviarse también)
      // - motivo: motivo ingresado
      
      // Endpoint sugerido: POST /api/solicitudes-cambio
      // Body: { id_usuario_solicitante, id_guardia, motivo }
      
      // SIMULACIÓN de envío al backend
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulamos éxito
      // Post-condiciones (según contrato):
      // - Se crea instancia Reemplazo con estado "pendiente"
      // - Se asocia a Usuario y Guardia
      
      setMensaje("✅ Solicitud registrada exitosamente. Estado: pendiente.");
      
      // Limpiar formulario y opcionalmente redirigir después de unos segundos
      setMotivo("");
      
      // Después de 2 segundos, volver al listado de guardias
      setTimeout(() => {
        onCancelar(); // o una función onSuccess específica
      }, 2000);
      
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
      setMensaje("❌ Error al registrar la solicitud. Intente nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="container">
      <h2>🔄 Solicitar Cambio de Guardia</h2>
      
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Guardia seleccionada</h3>
        <p>
          <strong>Fecha:</strong> {guardiaSeleccionada.fecha} <br />
          <strong>Horario:</strong> {guardiaSeleccionada.hora_inicio} - {guardiaSeleccionada.hora_fin} <br />
          <strong>Especialidad:</strong> {guardiaSeleccionada.especialidad}
        </p>
        <p style={{ fontSize: '0.9rem', color: '#475569' }}>
          Solicitante: {usuario.nombre}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
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

        {mensaje && (
          <div className={mensaje.startsWith("✅") ? "success-message" : "error-message"}>
            {mensaje}
          </div>
        )}
      </form>

      {/* Nota para trazabilidad backend */}
      <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#64748b', borderTop: '1px dashed #cbd5e1', paddingTop: '1rem' }}>
        <strong>📋 Trazabilidad backend:</strong> POST /api/solicitudes-cambio <br/>
        Body: &#123; id_usuario_solicitante, id_guardia, motivo &#125; → Esperado: 201 Created.
      </div>
    </div>
  );
};

export default SolicitudCambio;