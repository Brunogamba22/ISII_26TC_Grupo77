// src/Views/profesional/components/GuardiasAsignadas.jsx

import { useState, useEffect } from "react";
import { apiRequest } from "../../../apiClient";
import GuardiasCard from "./GuardiasCard";

/**
 * Componente que obtiene las guardias
 * del profesional y permite:
 *
 * - solicitar cambio
 * - visualizar pendientes
 * - cancelar solicitudes
 */
const GuardiasAsignadas = ({
  id_usuario,
  onSeleccionarGuardia,
  onGuardiasCargadas,
  irAlInicio,
}) => {

  /**
   * Estado local de guardias.
   */
  const [guardias, setGuardias] = useState([]);

  /**
   * Estado visual de carga.
   */
  const [cargando, setCargando] = useState(true);

  /**
   * Estado de errores.
   */
  const [error, setError] = useState("");

  
  /**
   * Carga inicial de guardias.
   */
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

        /**
         * Le avisamos al componente padre.
         */
        if (onGuardiasCargadas) {
          onGuardiasCargadas(lista);
        }

      } catch (err) {

        console.error(err);

        setError("Error al cargar guardias");

      } finally {

        setCargando(false);
      }
    };

    if (id_usuario) {
      cargarGuardias();
    }

  }, [id_usuario, onGuardiasCargadas]);

  
  /**
   * CANCELAR SOLICITUD
   *
   * Responsabilidades:
   * - eliminar reemplazo pendiente
   * - volver estado guardia a asignada
   * - actualizar frontend
   */
  const cancelarSolicitud = async (
    id_guardia
  ) => {

    try {

      const confirmar =
        window.confirm(
          "¿Desea cancelar la solicitud?"
        );

      if (!confirmar) {
        return;
      }

      const { response, data } =
        await apiRequest(
          `/solicitudes/cancelar/${id_guardia}`,
          {
            method: "PUT",
          }
        );

      if (!response.ok) {

        alert(
          data?.error ||
          "No se pudo cancelar"
        );

        return;
      }

      /**
       * Actualización dinámica local.
       *
       * NO recargamos página.
       */
      const nuevasGuardias =
        guardias.map((guardia) => {

          if (
            Number(guardia.id_guardia) ===
            Number(id_guardia)
          ) {

            return {
              ...guardia,
              estado: "asignada",
            };
          }

          return guardia;
        });

      setGuardias(nuevasGuardias);

      alert(
        "Solicitud cancelada correctamente"
      );

    } catch (error) {

      console.error(error);

      alert(
        "Error al cancelar solicitud"
      );
    }
  };

  /**
   * LOADING
   */
  if (cargando) {

    return (
      <div className="flex justify-center items-center py-20">

        <div
          className="
            animate-spin
            rounded-full
            h-10 w-10
            border-b-2
            border-blue-600
          "
        />

        <span className="ml-3 text-gray-600">
          Cargando guardias...
        </span>

      </div>
    );
  }

  /**
   * ERROR
   */
  if (error) {

    return (
      <div
        className="
          bg-red-50
          border border-red-200
          text-red-700
          px-6 py-4
          rounded-xl
        "
      >
        {error}
      </div>
    );
  }

  return (

    <div className="space-y-8">

      {/* CABECERA */}
      <header>

        <h1
          className="
            text-3xl
            font-bold
            text-gray-800
          "
        >
          Gestión de Reemplazos
        </h1>

        <p className="text-gray-500 mt-2">
          Selecciona una guardia para
          solicitar un cambio de turno.
        </p>

      </header>

      {/* GRID DE CARDS */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-2
          gap-4
        "
      >

        {
          guardias.map((guardia) => {

            return (

              <div
                key={guardia.id_guardia}
                
                className={`
                  cursor-pointer
                  transition-all
                  duration-200
                  transform
                  hover:scale-[1.02]
                `}
              >

                {/* CARD */}
                <GuardiasCard
                  guardia={guardia}

                  /**
                   * Solicitar cambio.
                   */
                  onSolicitarCambio={
                    onSeleccionarGuardia
                  }

                  /**
                   * Cancelar solicitud.
                   */
                  onCancelarSolicitud={
                    cancelarSolicitud
                  }
                />

              </div>
            );
          })
        }

      </div>

          {/* BOTONES */}
          <div className="flex flex-wrap gap-4 justify-end">

            {/* IR AL INICIO */}
            <button
              type="button"
              onClick={irAlInicio}
              className="
                px-6 py-3
                rounded-xl
                border border-cyan-300
                text-cyan-700
                hover:bg-cyan-50
                transition-colors
              "
            >
              Ir al Inicio
            </button>

          </div>

    </div>
  );
};

export default GuardiasAsignadas;