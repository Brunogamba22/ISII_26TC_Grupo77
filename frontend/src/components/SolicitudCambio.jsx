// Importamos useState para manejar estados
import { useState } from "react";

// Componente para solicitar cambio de guardia
const SolicitudCambio = () => {

  // Estado para guardar la guardia seleccionada (parámetro del contrato)
  const [idGuardia, setIdGuardia] = useState("");

  // Estado para guardar el motivo ingresado
  const [motivo, setMotivo] = useState("");

  // Estado para mostrar mensajes del sistema
  const [mensaje, setMensaje] = useState("");

  // Función que ejecuta el caso de uso "Solicitar cambio"
  const enviarSolicitud = (e) => {

    // Evita recarga
    e.preventDefault();

    //  VALIDACIÓN (Curso Alternativo 1)
    if (!idGuardia || !motivo) {
      setMensaje("Datos incompletos o fecha/turno inválido");
      return;
    }

    //  VALIDACIÓN (Curso Alternativo 2)
    // Simulamos que la guardia 2 está ocupada
    if (idGuardia === "2") {
      setMensaje("La fecha/hora seleccionada ya está ocupada. Seleccione otra fecha/hora");
      return;
    }

    // 🟢 POST-CONDICIÓN: creación de solicitud
    const nuevaSolicitud = {
      id: Date.now(),
      id_guardia: idGuardia,
      motivo: motivo,
      estado: "pendiente" // IMPORTANTE (trazabilidad)
    };

    // Simulación de guardado (backend en memoria)
    console.log("Solicitud creada:", nuevaSolicitud);

    // 🟢 Mensaje éxito (curso normal)
    setMensaje("Solicitud registrada con estado pendiente");

    // Limpiar campos
    setIdGuardia("");
    setMotivo("");
  };

  // Vista (Frontend = V del MVC)
  return (
    <div>

      <h2>Solicitud de Cambio</h2>

      <form onSubmit={enviarSolicitud}>

        {/* Selección de guardia */}
        <select
          value={idGuardia}
          onChange={(e) => setIdGuardia(e.target.value)}
        >
          <option value="">Seleccionar guardia</option>
          <option value="1">Guardia 1 (Disponible)</option>
          <option value="2">Guardia 2 (Ocupada)</option>
        </select>

        {/* Campo motivo */}
        <textarea
          placeholder="Motivo"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        />

        {/* Botón enviar */}
        <button type="submit">Solicitar Cambio</button>
      </form>

      {/* Mensaje del sistema */}
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default SolicitudCambio;