// Importamos useState para manejar estados
import { useState } from "react";

// Componente para solicitar cambio de guardia
const SolicitudCambio = () => {

  // Estado para guardar la guardia seleccionada
  const [idGuardia, setIdGuardia] = useState("");

  // Estado para guardar el motivo ingresado
  const [motivo, setMotivo] = useState("");

  // Estado para mostrar mensajes (éxito o error)
  const [mensaje, setMensaje] = useState("");

  // Función que se ejecuta al enviar el formulario
  const enviarSolicitud = async (e) => {

    // Evita recargar la página
    e.preventDefault();

    try {

      // Enviamos los datos al backend
      const response = await fetch("http://localhost:3000/api/solicitud", {

        // Método POST
        method: "POST",

        // Indicamos JSON
        headers: {
          "Content-Type": "application/json"
        },

        // Enviamos los datos necesarios
        body: JSON.stringify({
          id_guardia: idGuardia,
          motivo: motivo
        })
      });

      // Convertimos la respuesta
      const data = await response.json();

      // Si hay error del backend
      if (!response.ok) {

        // Mostramos mensaje de error
        setMensaje(data.error);

      } else {

        // Si todo salió bien
        setMensaje("Solicitud enviada correctamente");
      }

    } catch (error) {

      // Error de conexión
      console.error(error);

      // Mensaje genérico
      setMensaje("Error en el servidor");
    }
  };

  // Interfaz del componente
  return (
    <div>

      {/* Título */}
      <h2>Solicitud de Cambio</h2>

      {/* Formulario */}
      <form onSubmit={enviarSolicitud}>

        {/* Select para elegir guardia */}
        <select onChange={(e) => setIdGuardia(e.target.value)}>

          {/* Opción por defecto */}
          <option value="">Seleccionar guardia</option>

          {/* Opciones simuladas */}
          <option value="1">Guardia 1</option>
          <option value="2">Guardia 2</option>
        </select>

        {/* Textarea para ingresar motivo */}
        <textarea
          placeholder="Motivo"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)} // Actualiza estado
        />

        {/* Botón enviar */}
        <button type="submit">Solicitar Cambio</button>
      </form>

      {/* Mostrar mensaje */}
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

// Exportamos el componente
export default SolicitudCambio;