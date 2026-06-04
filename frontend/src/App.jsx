import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./Views/Login";
import GuardiasAsignadas from "./Views/GuardiasAsignadas";
import SolicitudCambio from "./Views/SolicitudCambio";
import AsignacionAutomatica from "./Views/AsignacionAutomatica";
import RutaProtegida from "./components/RutaProtegida"; // El componente que filtra por rol
import "./App.css";

/**
 * Componente raíz de la app (Enrutador Principal).
 * Responsabilidades:
 * - Orquestar navegación real mediante URLs.
 * - Proteger rutas según el rol del usuario (Administrador o Profesional).
 * - Mantener estados globales compartidos entre vistas.
 */
function AppContent() {
  const navigate = useNavigate();

  // Estados compartidos
  const [usuario, setUsuario] = useState(null);
  const [guardiaSeleccionada, setGuardiaSeleccionada] = useState(null);
  const [guardias, setGuardias] = useState([]);

  // Recuperar sesión al recargar la página (hidratación del estado)
  useEffect(() => {
    const idLocal = localStorage.getItem("id_usuario");
    const rolLocal = localStorage.getItem("rol");
    const nombreLocal = localStorage.getItem("nombre");
    if (idLocal && rolLocal) {
      setUsuario({ id_usuario: idLocal, rol: rolLocal, nombre: nombreLocal });
    }
  }, []);

  // Cierra sesión limpiando estados y localStorage
  const handleLogout = () => {
    setUsuario(null);
    setGuardiaSeleccionada(null);
    setGuardias([]);
    localStorage.clear(); // Limpiamos la "sesión"
    navigate("/login", { replace: true });
  };

  // Manejador para el Médico: Seleccionar guardia y avanzar a la solicitud
  const handleSeleccionarGuardia = (guardia) => {
    if (guardia) {
      setGuardiaSeleccionada(guardia);
      navigate("/medico/solicitud");
    } else {
      setGuardiaSeleccionada(null);
    }
  };

  return (
    <div>
      {/* HEADER GLOBAL (Solo visible si hay usuario) */}
      {usuario && (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#f1f5f9', marginBottom: '1rem' }}>
          <strong>Panel de {usuario.rol}</strong>
          <button className="logout-btn" onClick={handleLogout}>
            Cerrar sesión ({usuario.nombre})
          </button>
        </div>
      )}

      {/* SISTEMA DE RUTAS */}
      <Routes>
        {/* RUTA PÚBLICA */}
        <Route path="/login" element={<Login />} />

        {/* RUTAS DEL PROFESIONAL (MÉDICO) */}
        <Route element={<RutaProtegida rolesPermitidos={["Profesional"]} />}>
          
          <Route path="/medico" element={
            <GuardiasAsignadas 
              usuario={usuario} 
              onSeleccionarGuardia={handleSeleccionarGuardia} 
              onGuardiasCargadas={setGuardias}
            />
          } />

          <Route path="/medico/solicitud" element={
            guardiaSeleccionada ? (
              <SolicitudCambio 
                usuario={usuario}
                guardiaSeleccionada={guardiaSeleccionada}
                guardias={guardias}
                onCancelar={() => {
                  setGuardiaSeleccionada(null);
                  navigate("/medico");
                }}
              />
            ) : (
              <Navigate to="/medico" replace />
            )
          } />
        </Route>

        {/* RUTAS DEL ADMINISTRADOR */}
        <Route element={<RutaProtegida rolesPermitidos={["Administrador"]} />}>
          <Route path="/admin" element={
            <AsignacionAutomatica onVolver={() => navigate("/admin")} />
          } />
        </Route>

        {/* REDIRECCIÓN POR DEFECTO */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

// Envolvemos todo en BrowserRouter en el export
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;