import { useState } from "react";
import { apiRequest } from "../apiClient";

/**
 * Componente Login
 * Trazabilidad: Caso de Uso "Iniciar Sesión" (subnivel <<include>>)
 * Contrato de Operación 2: validarCredenciales(email, contraseña)
 * Referencia: Tabla 12 del documento del proyecto
 */
const Login = ({ onLogin }) => {
  // Estados: parámetros del contrato
  // Email ingresado por el usuario (credencial).
  const [email, setEmail] = useState("");
  // Contraseña ingresada por el usuario (se envía como `contraseña` al backend por contrato).
  const [password, setPassword] = useState("");
  // Mensaje de UI para feedback (éxito/error) sin depender de alertas del navegador.
  const [mensaje, setMensaje] = useState("");
  // Flag para bloquear inputs y evitar doble submit mientras se valida contra la API.
  const [cargando, setCargando] = useState(false);

  /**
   * Maneja el envío del formulario.
   * Implementa el curso normal y los cursos alternativos definidos en la conversación.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    // Pre-condición: campos no vacíos (Curso Alternativo 6.1.1 - datos incompletos)
    if (!email.trim() || !password.trim()) {
      setMensaje("❌ Datos incompletos. Ingrese email y contraseña.");
      return;
    }

    setCargando(true);

    try {
      // Llamada al contrato `/api/login`. Se mantiene el nombre `contraseña` por compatibilidad con backend.
      const { response, data } = await apiRequest("/login", {
        method: "POST",
        body: { email, contraseña: password },
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
      if (!id_usuario) {
        setMensaje("❌ Respuesta inválida del servidor (falta id_usuario).");
        return;
      }

      const usuario = {
        id_usuario,
        nombre: data?.usuario?.nombre || "Usuario",
        email,
      };

      // Persistencia mínima para reutilizar el id en la sesión del navegador (no implica autorización real).
      localStorage.setItem("id_usuario", String(id_usuario));
      setMensaje("✅ Inicio de sesión exitoso. Redirigiendo...");

      // Notifica al componente padre para avanzar al siguiente paso del flujo.
      onLogin(usuario);
      
    } catch (error) {
      console.error("Error en autenticación:", error);
      setMensaje("❌ Error de conexión con el servidor. Intente más tarde.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container">
      <h2>🔐 Acceso Profesional</h2>
      <p style={{ color: '#475569', marginBottom: '2rem' }}>
        Ingrese sus credenciales para gestionar guardias médicas
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            placeholder="medico@hospital.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={cargando}
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={cargando}
            autoComplete="current-password"
          />
        </div>

        <button type="submit" disabled={cargando}>
          {cargando ? "Verificando..." : "Ingresar"}
        </button>

        {mensaje && (
          <div className={mensaje.startsWith("✅") ? "success-message" : "error-message"}>
            {mensaje}
          </div>
        )}
      </form>

      
      
    </div>
  );
};

export default Login;