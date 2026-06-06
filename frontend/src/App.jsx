import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./Views/Login";
//import GuardiasAsignadas from "./Views/GuardiasAsignadas";
//import SolicitudCambio from "./Views/SolicitudCambio";
import RutaProtegida from "./components/RutaProtegida"; // El componente que filtra por rol
import AdminPanel from "./Views/admin/AdminPanel";
import VistaPersonal from "./Views/admin/pages/VistaPersonal";
import VistaEspecialidades from "./Views/admin/pages/VistaEspecialidades";
import VistaCalendario from "./Views/admin/pages/VistaCalendario";
import VistaAprobaciones from "./Views/admin/pages/VistaAprobaciones";
import VistaAsignacionAutomatica from "./Views/admin/pages/VistaAsignacionAutomatica";
import "./index.css";
import "./styles/admin.css";


//nueva ruta
import ProfesionalPanel from "./Views/profesional/ProfesionalPanel";

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
      

      {/* SISTEMA DE RUTAS */}
      <Routes>
        {/* RUTA PÚBLICA */}
        <Route
          path="/login"
          element={
            <Login
              onLogin={(usuarioSesion) => setUsuario(usuarioSesion)}
            />
          }
        />

        {/* RUTAS DEL PROFESIONAL (MÉDICO) */}
        <Route element={<RutaProtegida rolesPermitidos={["Profesional"]} />}>

        <Route
          path="/medico"
          element={
            <ProfesionalPanel
              usuario={usuario}
              guardias={guardias}
              setGuardias={setGuardias}
              guardiaSeleccionada={guardiaSeleccionada}
              setGuardiaSeleccionada={setGuardiaSeleccionada}
            />
          }
        />

        </Route>
          
        {/* <Route path="/medico" element={
            <GuardiasAsignadas 
              usuario={usuario} 
              onSeleccionarGuardia={handleSeleccionarGuardia} 
              onGuardiasCargadas={setGuardias}
            />
          } /> */}



         {/*} <Route path="/medico/solicitud" element={
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
        </Route>*/}

        {/* RUTAS DEL ADMINISTRADOR */}
        <Route element={<RutaProtegida rolesPermitidos={["Administrador"]} />}>
          <Route path="/admin" element={<AdminPanel />}>
            <Route index element={<Navigate to="personal" replace />} />
            <Route path="personal" element={<VistaPersonal />} />
            <Route path="especialidades" element={<VistaEspecialidades />} />
            <Route path="calendario" element={<VistaCalendario />} />
            <Route path="aprobaciones" element={<VistaAprobaciones />} />
            <Route path="asignacion" element={<VistaAsignacionAutomatica />} />
          </Route>
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