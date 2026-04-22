import { useState, useEffect } from "react";

/**
 * Componente GuardiasAsignadas
 * Trazabilidad: Caso de Uso "Consultar Guardias Asignadas" (<<include>> de Solicitar Cambio)
 * Referencia: Tabla 7 del documento del proyecto.
 * 
 * @param {Object} usuario - Datos del profesional autenticado.
 * @param {Function} onSeleccionarGuardia - Callback cuando elige una guardia.
 */
const GuardiasAsignadas = ({ usuario, onSeleccionarGuardia }) => {
  const [guardias, setGuardias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [guardiaSeleccionada, setGuardiaSeleccionada] = useState(null);

  useEffect(() => {
    const cargarGuardias = async () => {
      try {
        // SIMULACIÓN / ENDPOINT BACKEND
        // Endpoint sugerido: GET /api/guardias?id_usuario={usuario.id_usuario}
        // Respuesta esperada: Array de objetos guardia con id_guardia, fecha_hora, especialidad, etc.
        
        // Datos simulados para demostración
        const guardiasSimuladas = [
          { id_guardia: 101, fecha: "2026-05-15", hora_inicio: "08:00", hora_fin: "20:00", especialidad: "Clínica Médica" },
          { id_guardia: 102, fecha: "2026-05-16", hora_inicio: "20:00", hora_fin: "08:00", especialidad: "Guardia Pasiva" },
          { id_guardia: 103, fecha: "2026-05-20", hora_inicio: "08:00", hora_fin: "20:00", especialidad: "Pediatría" },
        ];
        
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setGuardias(guardiasSimuladas);
        setCargando(false);
      } catch (err) {
        setError("No se pudieron cargar las guardias asignadas.");
        setCargando(false);
      }
    };

    cargarGuardias();
  }, [usuario.id_usuario]);

  const handleSeleccion = (guardia) => {
    setGuardiaSeleccionada(guardia.id_guardia);
    onSeleccionarGuardia(guardia);
  };

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
        <button onClick={() => onSeleccionarGuardia(null)}>Volver</button>
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
        {guardias.map(guardia => (
          <div 
            key={guardia.id_guardia}
            className={`guardia-item ${guardiaSeleccionada === guardia.id_guardia ? 'seleccionada' : ''}`}
            onClick={() => handleSeleccion(guardia)}
          >
            <div>
              <strong>{guardia.fecha}</strong> · {guardia.hora_inicio} a {guardia.hora_fin}
              <br />
              <span className="badge">{guardia.especialidad}</span>
            </div>
            <div style={{ fontSize: '1.5rem' }}>
              {guardiaSeleccionada === guardia.id_guardia ? '✅' : '⏺️'}
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => onSeleccionarGuardia(null)} 
        style={{ backgroundColor: '#64748b', marginTop: '0' }}
      >
        Cancelar
      </button>
    </div>
  );
};

export default GuardiasAsignadas;