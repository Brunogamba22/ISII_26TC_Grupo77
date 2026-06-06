import { useState } from "react";

import GuardiasAsignadas from "../components/GuardiasAsignadas";
import SolicitudCambio from "../components/SolicitudCambio";

function VistaReemplazos() {

  const id_usuario =
    localStorage.getItem("id_usuario");

  const nombre =
    localStorage.getItem("nombre");

  const rol =
    localStorage.getItem("rol");

  const usuario = {
    id_usuario,
    nombre,
    rol,
  };

  const [guardias, setGuardias] =
    useState([]);

  const [
    guardiaSeleccionada,
    setGuardiaSeleccionada,
  ] = useState(null);

  return (
    <div className="space-y-6">

      {
        !guardiaSeleccionada ? (

          <GuardiasAsignadas
            id_usuario={id_usuario}
            onSeleccionarGuardia={
              setGuardiaSeleccionada
            }
            onGuardiasCargadas={
              setGuardias
            }
          />

        ) : (

          <SolicitudCambio
            usuario={usuario}
            guardiaSeleccionada={
              guardiaSeleccionada
            }
            guardias={guardias}
            onCancelar={() =>
              setGuardiaSeleccionada(null)
            }
          />

        )
      }

    </div>
  );
}

export default VistaReemplazos;