import { Navigate, Outlet } from "react-router-dom";
import { normalizarRol } from "../utils/rolCompat";

const RutaProtegida = ({ rolesPermitidos }) => {
  const idUsuario = localStorage.getItem("id_usuario");
  const rolRaw = localStorage.getItem("rol");
  const rolUsuario = normalizarRol(rolRaw);

  // 1. Si no hay sesión, siempre al login
  if (!idUsuario) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si el usuario existe pero el rol es nulo o inválido, cerrar sesión forzosa
  if (!rolUsuario) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  // 3. Validación de permisos
  if (rolesPermitidos && !rolesPermitidos.includes(rolUsuario)) {
    // Redirigir según su rol real en lugar de permitirle acceso no autorizado
    return <Navigate to={rolUsuario === "Administrador" ? "/admin/personal" : "/medico"} replace />;
  }

  // Todo correcto, mostrar la ruta
  return <Outlet />;
};

export default RutaProtegida;