import { useState } from "react";
import Login from "./Views/Login";
import GuardiasAsignadas from "./Views/GuardiasAsignadas";
import SolicitudCambio from "./Views/SolicitudCambio";
import "./App.css";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [guardiaSeleccionada, setGuardiaSeleccionada] = useState(null);
  const [guardias, setGuardias] = useState([]);
  const [vista, setVista] = useState("login"); // "login", "guardias", "solicitud"

  const handleLogin = (user) => {
    setUsuario(user);
    setVista("guardias");
  };

  const handleLogout = () => {
    setUsuario(null);
    setGuardiaSeleccionada(null);
    setGuardias([]);
    setVista("login");
  };

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