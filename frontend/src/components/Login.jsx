// Importamos el hook useState de React para manejar estados
import { useState } from "react";

// Componente Login que recibe una función onLogin como prop
const Login = ({ onLogin }) => {

  // Estado para guardar el email ingresado (parámetro del contrato)
  const [email, setEmail] = useState("");

  // Estado para guardar la contraseña ingresada (parámetro del contrato)
  const [contraseña, setContraseña] = useState("");

  // Estado para mostrar mensajes de error o alerta (curso alternativo)
  const [mensaje, setMensaje] = useState("");

  // Función que ejecuta el proceso de autenticación
  const iniciarSesion = (e) => {

    // Evita recarga de página
    e.preventDefault();

    // VALIDACIÓN (Curso Alternativo 1)
    // Si faltan datos → error según contrato
    if (!email || !contraseña) {
      setMensaje("Datos incompletos");
      return;
    }

    // SIMULACIÓN BACKEND (Trazabilidad: Validar credenciales)
    const usuarioEncontrado =
      email === "medico@hospital.com" && contraseña === "123";

    // Curso Alternativo 2.1.1 (credenciales inválidas)
    if (!usuarioEncontrado) {
      setMensaje("Credenciales incorrectas o usuario inexistente");
      return;
    }

    // POST-CONDICIÓN: creación de sesión (simulada)
    const usuario = {
      id_usuario: 1,
      nombre: "Juan"
    };

    // Mensaje limpio
    setMensaje("");

    // Trazabilidad: Usuario válido → pasa a siguiente pantalla
    onLogin(usuario);
  };

  // Vista (Frontend = V del MVC)
  return (
    <div>

      <h2>Login</h2>

      <form onSubmit={iniciarSesion}>

        {/* Campo EMAIL (input del contrato) */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Campo CONTRASEÑA */}
        <input
          type="password"
          placeholder="Contraseña"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
        />

        {/* Botón que dispara el caso de uso */}
        <button type="submit">Ingresar</button>
      </form>

      {/* Mensaje de error (curso alternativo) */}
      {mensaje && <p style={{ color: "red" }}>{mensaje}</p>}
    </div>
  );
};

export default Login;