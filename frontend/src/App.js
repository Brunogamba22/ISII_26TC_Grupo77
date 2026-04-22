import { useState } from "react";
import Login from "./Views/Login";
import GuardiasAsignadas from "./Views/GuardiasAsignadas";
import SolicitudCambio from "./Views/SolicitudCambio";
import "./App.css";

/**
 * Componente raíz de la app.
 *
 * Responsabilidades:
 * - Orquestar navegación simple por estado (`vista`) sin router.
 * - Mantener el usuario autenticado y el contexto de selección de guardia.
 * - Encadenar callbacks entre pantallas (login → listado → solicitud).
 */
function App() {
  // Usuario autenticado (payload mínimo provisto por el backend).
  const [usuario, setUsuario] = useState(null);

  // Guardia actualmente seleccionada para iniciar una solicitud de cambio.
  const [guardiaSeleccionada, setGuardiaSeleccionada] = useState(null);

  // Cache local de guardias cargadas (se reutiliza en la pantalla de solicitud).
  const [guardias, setGuardias] = useState([]);

  // Control de navegación interna: evita dependencia de rutas para un flujo lineal.
  const [vista, setVista] = useState("login"); // "login", "guardias", "solicitud"

  // Callback que se ejecuta cuando Login valida credenciales con éxito.
  const handleLogin = (user) => {
    setUsuario(user);
    setVista("guardias");
  };

  // Cierra sesión limpiando el estado compartido para evitar datos "arrastrados" entre usuarios.
  const handleLogout = () => {
    setUsuario(null);
    setGuardiaSeleccionada(null);
    setGuardias([]);
    setVista("login");
  };

  // Cambia el contexto de selección y navega según haya una guardia elegida o una cancelación.
  const handleSeleccionarGuardia = (guardia) => {
    if (guardia) {
      setGuardiaSeleccionada(guardia);
      setVista("solicitud");
    } else {
      // Si cancela selección, volver a la lista de guardias
      setVista("guardias");
      setGuardiaSeleccionada(null);
    }
  };

  // Handler específico para volver desde la pantalla de solicitud sin cerrar sesión.
  const handleCancelarSolicitud = () => {
    setVista("guardias");
    setGuardiaSeleccionada(null);
  };

  return (
    <div>
      {vista === "login" && <Login onLogin={handleLogin} />}
      
      {vista === "guardias" && usuario && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button className="logout-btn" onClick={handleLogout}>
              Cerrar sesión ({usuario.nombre})
            </button>
          </div>
          <GuardiasAsignadas 
            usuario={usuario} 
            onSeleccionarGuardia={handleSeleccionarGuardia} 
            onGuardiasCargadas={setGuardias}
          />
        </>
      )}
      
      {vista === "solicitud" && usuario && guardiaSeleccionada && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button className="logout-btn" onClick={handleLogout}>
              Cerrar sesión ({usuario.nombre})
            </button>
          </div>
          <SolicitudCambio 
            usuario={usuario}
            guardiaSeleccionada={guardiaSeleccionada}
            guardias={guardias}
            onCancelar={handleCancelarSolicitud}
          />
        </>
      )}
    </div>
  );
}

export default App;