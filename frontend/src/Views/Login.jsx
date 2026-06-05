import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, Loader2 } from 'lucide-react';
import { apiRequest } from "../apiClient";
import { normalizarRol, rutaPorRol } from "../utils/rolCompat";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (!email.trim() || !password.trim()) {
      setMensaje("❌ Datos incompletos. Ingrese email y contraseña.");
      return;
    }

    setCargando(true);

    try {
      const { response, data } = await apiRequest("/login", {
        method: "POST",
        body: { email, contrasena: password },
      });

      if (response.status === 401) {
        setMensaje(data?.error || "Credenciales inválidas.");
        return;
      }

      if (!response.ok) {
        setMensaje(data?.error || "❌ Error al iniciar sesión. Intente nuevamente.");
        return;
      }

      const id_usuario = data?.usuario?.id_usuario;
      const rol = normalizarRol(data?.usuario?.rol);

      if (!id_usuario || !rol) {
        setMensaje("❌ Respuesta inválida del servidor.");
        return;
      }

      const destino = rutaPorRol(rol);
      if (!destino) {
        setMensaje(`❌ Rol no reconocido: "${data?.usuario?.rol}".`);
        return;
      }

      const usuarioSesion = {
        id_usuario: String(id_usuario),
        rol,
        nombre: data.usuario.nombre,
        apellido: data.usuario.apellido,
        email: data.usuario.email,
      };

      localStorage.setItem("id_usuario", usuarioSesion.id_usuario);
      localStorage.setItem("rol", usuarioSesion.rol);
      localStorage.setItem("nombre", usuarioSesion.nombre);

      if (typeof onLogin === "function") {
        onLogin(usuarioSesion);
      }

      setMensaje("✅ Inicio de sesión exitoso. Redirigiendo...");
      navigate(destino, { replace: true });
      
    } catch (error) {
      console.error("Error en autenticación:", error);
      setMensaje("❌ Error de conexión con el servidor. Intente más tarde.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-200">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-semibold text-gray-800">
            MediGuard <span className="text-cyan-600">Pro</span>
          </span>
        </div>

        {/* Tarjeta de Login */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 mb-1">Bienvenido de nuevo</h1>
            <p className="text-sm text-gray-500">Ingrese sus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Feedback de mensajes */}
            {mensaje && (
              <div className={`text-sm rounded-xl px-4 py-3 border ${mensaje.startsWith("✅") ? "bg-green-50 border-green-200 text-green-600" : "bg-red-50 border-red-200 text-red-600"}`}>
                {mensaje}
              </div>
            )}

            {/* Email field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={cargando}
                  placeholder="medico@hospital.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all disabled:opacity-50"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={cargando}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all disabled:opacity-50"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-lg shadow-cyan-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {cargando ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verificando...</span>
                </>
              ) : (
                <span>Ingresar</span>
              )}
            </button>
          </form>
        </div>
        
        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-8">
          © 2026 MediGuard Pro. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default Login;