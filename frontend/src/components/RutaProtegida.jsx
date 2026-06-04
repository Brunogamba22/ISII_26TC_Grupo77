import { Navigate, Outlet } from "react-router-dom";

/**
 * Componente Wrapper para proteger rutas según el rol.
 * @param {Array} rolesPermitidos - Array de strings con los roles que pueden pasar.
 */
const RutaProtegida = ({ rolesPermitidos }) => {
  const idUsuario = localStorage.getItem("id_usuario");
  const rolUsuario = localStorage.getItem("rol");

  // Si no hay usuario logueado, lo mandamos al Login
  if (!idUsuario) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario está logueado pero NO tiene un rol permitido para esta ruta
  if (rolesPermitidos && !rolesPermitidos.includes(rolUsuario)) {
    // Redirigir según su rol (o a una página de "Acceso Denegado")
    if (rolUsuario === "Administrador") return <Navigate to="/admin" replace />;
    if (rolUsuario === "Profesional") return <Navigate to="/medico" replace />;
    return <Navigate to="/login" replace />;
  }

  // Si pasa las validaciones, renderiza los componentes hijos (las rutas internas)
  return <Outlet />;
};

export default RutaProtegida;