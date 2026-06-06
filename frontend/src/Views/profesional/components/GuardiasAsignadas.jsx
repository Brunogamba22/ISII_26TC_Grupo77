import { useState, useEffect } from "react";
import { apiRequest } from "../../../apiClient";
import {
  formatFechaYYYYMMDDToDDMMYYYY,
  formatHorarioHHMMToHHMM,
} from "../../../utils/formatters";

const GuardiasAsignadas = ({
  id_usuario,
  onSeleccionarGuardia,
  onGuardiasCargadas,
}) => {

  const [guardias, setGuardias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [guardiaSeleccionadaId, setGuardiaSeleccionadaId] =
    useState(null);

  useEffect(() => {

    const cargarGuardias = async () => {

      try {

        setCargando(true);
        setError("");

        const { response, data } =
          await apiRequest(
            `/guardias/${id_usuario}`
          );

        if (!response.ok) {

          setError(
            data?.mensaje ||
            "No se pudieron cargar las guardias"
          );

          return;
        }

        const lista = data?.guardias || [];

        setGuardias(lista);

        if (onGuardiasCargadas) {
          onGuardiasCargadas(lista);
        }

      } catch (error) {

        console.error(error);

        setError(
          "Error al cargar guardias"
        );

      } finally {

        setCargando(false);
      }
    };

    if (id_usuario) {
      cargarGuardias();
    }

  }, [id_usuario]);

  const guardiaSeleccionada =
    guardias.find(
      (g) =>
        Number(g.id_guardia) ===
        Number(guardiaSeleccionadaId)
    );

  if (cargando) {
    return (
      <div className="text-slate-500">
        Cargando guardias...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-2xl">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <header>
        <h1 className="text-4xl font-bold text-slate-800">
          Gestión de Reemplazos
        </h1>

        <p className="text-slate-500 mt-2">
          Seleccione una guardia para solicitar reemplazo
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {guardias.map((guardia) => {

          const seleccionada =
            Number(guardia.id_guardia) ===
            Number(guardiaSeleccionadaId);

          return (
            <div
              key={guardia.id_guardia}
              onClick={() =>
                setGuardiaSeleccionadaId(
                  guardia.id_guardia
                )
              }
              className={`
                p-6 rounded-3xl border cursor-pointer
                transition-all duration-200
                hover:shadow-lg
                ${
                  seleccionada
                    ? "border-cyan-500 bg-cyan-50"
                    : "border-slate-200 bg-white"
                }
              `}
            >

              <div className="flex justify-between items-start">

                <div>

                  <h2 className="text-2xl font-bold text-cyan-700">
                    {
                      formatFechaYYYYMMDDToDDMMYYYY(
                        guardia.fecha
                      )
                    }
                  </h2>

                  <p className="text-slate-500 mt-2">
                    Guardia #
                    {guardia.id_guardia}
                  </p>

                </div>

                <div className="text-3xl">
                  {
                    seleccionada
                      ? "✅"
                      : "📅"
                  }
                </div>

              </div>

              <div className="mt-4 inline-block bg-slate-100 px-4 py-2 rounded-xl">

                {
                  formatHorarioHHMMToHHMM(
                    guardia.hora_inicio
                  )
                }

              </div>

            </div>
          );
        })}

      </div>

      <button
        disabled={!guardiaSeleccionada}
        onClick={() =>
          onSeleccionarGuardia(
            guardiaSeleccionada
          )
        }
        className="
          px-6 py-3 rounded-2xl
          bg-cyan-600 text-white
          hover:bg-cyan-700
          disabled:bg-slate-300
          font-semibold
        "
      >
        Solicitar Cambio
      </button>

    </div>
  );
};

export default GuardiasAsignadas;