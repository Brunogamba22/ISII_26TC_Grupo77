import { useState } from "react";

const AsignacionAutomatica = () => {

  const [mes, setMes] = useState("");
  const [anio, setAnio] = useState(new Date().getFullYear());

  const [maxGuardiasConsecutivas, setMaxGuardiasConsecutivas] = useState(3);

  const [equidadFinesSemana, setEquidadFinesSemana] = useState(true);

  const [evitarEspecialidadesCriticas, setEvitarEspecialidadesCriticas] = useState(true);

  const [observaciones, setObservaciones] = useState("");

  const handleGenerar = () => {
    console.log({
      mes,
      anio,
      maxGuardiasConsecutivas,
      equidadFinesSemana,
      evitarEspecialidadesCriticas,
      observaciones
    });
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
            onChange={(e) => setAnio(e.target.value)}
          />
        </div>

        <hr />

        <h3>⚙️ Reglas Equitativas</h3>

        <div className="form-group">
          <label>Máximo de guardias consecutivas</label>

          <input
            type="number"
            min="1"
            max="10"
            value={maxGuardiasConsecutivas}
            onChange={(e) =>
              setMaxGuardiasConsecutivas(e.target.value)
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
            Distribución equitativa de fines de semana
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

          <textarea
            rows="4"
            value={observaciones}
            onChange={(e) =>
              setObservaciones(e.target.value)
            }
          />
        </div>

        <button onClick={handleGenerar}>
          Generar Asignación Automática
        </button>

      </div>
    </div>
  );
};

export default AsignacionAutomatica;