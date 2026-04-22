// Importamos useState para manejar el estado del usuario logueado
import { useState } from "react";

// Importamos nuestros componentes
import Login from "./components/Login";
import SolicitudCambio from "./components/SolicitudCambio";

// Componente principal de la app
function App() {

  // Estado para guardar el usuario logueado
  const [usuario, setUsuario] = useState(null);

  return (
    <div>

      {/* Si NO hay usuario → mostramos login */}
      {!usuario ? (

        <Login onLogin={setUsuario} />

      ) : (

        // Si hay usuario → mostramos la pantalla principal
        <SolicitudCambio />

      )}

    </div>
  );
}

// Exportamos el componente
export default App;
