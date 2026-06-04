import { useState } from "react";
import { apiRequest } from "../apiClient";

const AsignacionAutomatica = ({ onVolver }) => {

  const [mes, setMes] = useState("");
  const [anio, setAnio] = useState(new Date().getFullYear());

  const [maxGuardiasConsecutivas, setMaxGuardiasConsecutivas] = useState(3);

  const [equidadFinesSemana, setEquidadFinesSemana] = useState(true);

  const [evitarEspecialidadesCriticas, setEvitarEspecialidadesCriticas] = useState(true);

  const [observaciones, setObservaciones] = useState("");

  const [mensaje, setMensaje] = useState("");// Mensaje de UI para feedback de éxito/error (se muestra sin desmontar el componente).
  const [turnosGenerados, setTurnosGenerados] = useState([]);// Lista de turnos generados.
  const [cargando, setCargando] = useState(false);// Flag de carga para mostrar feedback mientras se generan los turnos.
  

  const handleGenerar = async () => {

    setMensaje("");
  
    // Validación básica
    if (!mes || !anio) {
      setMensaje("❌ Debe completar mes y año.");
      return;
    }

    if (anio < 2025) {
      setMensaje("❌ El año debe ser válido.");
      return;
    }
  
    // Confirmación requerida por el caso de uso
    const confirmado = window.confirm(
      "¿Desea generar automáticamente las guardias?"
    );
  
    if (!confirmado) {
      return;
    }
  
    setCargando(true);
    setTurnosGenerados([]);
    try {
  
      // =========================
      // PASO 1 -> CONFIGURAR
      // =========================
  
      const reglasEquidad = {
        maxGuardiasConsecutivas,
        equidadFinesSemana,
        evitarEspecialidadesCriticas,
        observaciones
      };
  
      const configuracion = await apiRequest(
        "/asignacion/configurar",
        {
          method: "POST",
          body: {
            mes,
            anio,
            reglasEquidad
          }
        }
      );
  
      if (!configuracion.response.ok) {
        setMensaje(
          configuracion.data?.error ||
          "❌ Error configurando parámetros."
        );
        return;
      }
  
      const id_calendario =
        configuracion.data.id_calendario;
  
      // =========================
      // PASO 2 -> GENERAR
      // =========================
  
      const diasDelMes = new Date(anio, mes, 0).getDate();
  
      const generacion = await apiRequest(
        "/asignacion/generar",
        {
          method: "POST",
          body: {
            id_calendario,
            diasDelMes,
            id_especialidad: 1,
            anio,
            mes
          }
        }
      );
  
      // =========================
      // ERROR DE NEGOCIO
      // =========================
  
      if (!generacion.response.ok) {
  
        setMensaje(
          generacion.data?.error ||
          "❌ Error generando guardias."
        );
  
        return;
      }
  
      // =========================
      // ÉXITO
      // =========================
  
      setMensaje("✅ Guardias generadas correctamente.");
  
      setTurnosGenerados(
        generacion.data.turnos || []
      );
  
    } catch (error) {
  
      console.error(error);
  
      setMensaje(
        "❌ Error de conexión con el servidor."
      );
  
    } finally {
  
      setCargando(false);
  
    }
  };

  return (
    <div className="container">

      <h2>🏥 Asignación Automática de Guardias</h2>

      <div className="card">

        <div className="form-group">
          <label>Mes</label>

          <select
            value={mes}
            onChange={(e) => setMes(e.target.value)}
          >
            <option value="">Seleccione un mes</option>
            <option value="1">Enero</option>
            <option value="2">Febrero</option>
            <option value="3">Marzo</option>
            <option value="4">Abril</option>
            <option value="5">Mayo</option>
            <option value="6">Junio</option>
            <option value="7">Julio</option>
            <option value="8">Agosto</option>
            <option value="9">Septiembre</option>
            <option value="10">Octubre</option>
            <option value="11">Noviembre</option>
            <option value="12">Diciembre</option>
          </select>
        </div>

        <div className="form-group">
          <label>Año</label>

          <input
            type="number"
            value={anio}
            onChange={(e) => setAnio(Number(e.target.value))}
          />
        </div>

        <hr />

        <h3>⚙️ Reglas Equitativas</h3>

        <div className="form-group">
        <label>
          Máximo de guardias consecutivas
        </label>

        <small>
          Ejemplo: 3 significa que un profesional no podrá
          trabajar más de 3 guardias seguidas.
        </small>

          <input
            type="number"
            min="1"
            max="10"
            value={maxGuardiasConsecutivas}
            onChange={(e) =>
              setMaxGuardiasConsecutivas(Number(e.target.value))
            }
          />
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            checked={equidadFinesSemana}
            onChange={() =>
              setEquidadFinesSemana(!equidadFinesSemana)
            }
          />

          <label>
            Distribuir equitativamente las guardias de fines de semana
          </label>
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            checked={evitarEspecialidadesCriticas}
            onChange={() =>
              setEvitarEspecialidadesCriticas(
                !evitarEspecialidadesCriticas
              )
            }
          />

          <label>
            Evitar colisiones con especialidades críticas
          </label>
        </div>

        <div className="form-group">
          <label>Observaciones</label>
          <small>
            Ejemplo: Priorizar médicos de terapia intensiva
            para turnos nocturnos.
          </small>

          <textarea
            rows="4"
            value={observaciones}
            onChange={(e) =>
              setObservaciones(e.target.value)
            }
          />
        </div>

        <button
          onClick={handleGenerar}
          disabled={cargando}
          style={{
            opacity: cargando ? 0.7 : 1,
            cursor: cargando ? "not-allowed" : "pointer"
          }}
        >
          {cargando
            ? "Generando..."
            : "Generar Asignación Automática"}
        </button>

        <button
          type="button"
          onClick={onVolver}
          style={{ marginTop: "1rem" }}
          >
          Volver
        </button>

        {mensaje && (
          <div
            className={
              mensaje.startsWith("✅")
                ? "success-message"
                : "error-message"
            }
          >
            {mensaje}
          </div>
        )}

        {mensaje.includes("No hay suficientes profesionales") && (
          <div className="card">
            <h4>⚠️ Asignación Manual Recomendada</h4>

            <p>
              El sistema no encontró suficientes profesionales
              para cubrir todos los turnos automáticamente.
            </p>

            <p>
              Se recomienda realizar una asignación manual
              de guardias.
            </p>
          </div>
        )}

      </div>


      {turnosGenerados.length > 0 && (

      <div className="card">

          <h3>
            📋 Cronograma Generado
          </h3>

          <p>
            <strong>Total de guardias generadas:</strong>{" "}
            {turnosGenerados.length}
          </p>

          <p>
            <strong>Estado del cronograma:</strong>{" "}
            Confirmado
          </p>

          <button
            onClick={() => window.print()}
            style={{ marginBottom: "1rem" }}
          >
            Exportar Cronograma
          </button>

          {turnosGenerados.map((turno, index) => (

       <div
        key={index}
        className="guardia-item"
       >

        <div>

          <strong>
            Día:
          </strong> {turno.dia}

          <br />

          <strong>Profesional:</strong> {turno.nombreCompleto}

            <br />

            <strong>Horario:</strong> {turno.horario}

            <br />

          <strong>Estado:</strong> {turno.estado}

        </div>

        </div>

            ))}

        </div>

          )}
    </div>
  );
};

export default AsignacionAutomatica;