import { useState } from "react";

/**
 * Componente Login
 * Trazabilidad: Caso de Uso "Iniciar Sesión" (subnivel <<include>>)
 * Contrato de Operación 2: validarCredenciales(email, contraseña)
 * Referencia: Tabla 12 del documento del proyecto
 */
const Login = ({ onLogin }) => {
  // Estados: parámetros del contrato
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
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
      // SIMULACIÓN / CONEXIÓN CON BACKEND
      // Aquí se debe reemplazar por una llamada real al endpoint de autenticación.
      // Endpoint sugerido: POST /api/auth/login
      // Body: { email, contraseña }  (contraseña en texto plano solo para demo, en producción usar HTTPS y hash)
      // Esperado: { id_usuario, nombre, token? } o error 401.
      
      // Simulación con credenciales fijas (como en tu versión original)
      const esValido = email === "medico@hospital.com" && password === "123";
      
      if (!esValido) {
        // Curso Alternativo 2.1.1 - Credenciales incorrectas o usuario inexistente
        setMensaje("❌ Credenciales incorrectas o usuario inexistente.");
        setCargando(false);
        return;
      }

      // Post-condición: Se crea una instancia de Sesión (simulada con objeto usuario)
      const usuario = {
        id_usuario: 1,
        nombre: "Dr. Juan Pérez",
        email: email
      };

      // Mensaje de éxito (opcional)
      setMensaje("✅ Inicio de sesión exitoso. Redirigiendo...");
      
      // Trazabilidad: Usuario válido -> se notifica al componente padre
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

      {/* Nota para el desarrollador backend */}
      <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#64748b', borderTop: '1px dashed #cbd5e1', paddingTop: '1rem' }}>
        <strong>📋 Trazabilidad backend:</strong> POST /api/auth/login <br/>
        Body: &#123; email, contraseña &#125; → Respuesta esperada: &#123; id_usuario, nombre, ... &#125; o error 401.
      </div>
    </div>
  );
};

export default Login;