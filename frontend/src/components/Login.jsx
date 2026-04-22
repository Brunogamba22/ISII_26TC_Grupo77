// Importamos el hook useState de React para manejar estados
import { useState } from "react";

// Componente Login que recibe una función onLogin como prop
const Login = ({ onLogin }) => {

  // Estado para guardar el email ingresado
  const [email, setEmail] = useState("");

  // Estado para guardar la contraseña ingresada
  const [contraseña, setContraseña] = useState("");

  // Estado para mostrar mensajes de error o alerta
  const [mensaje, setMensaje] = useState("");
  
// Simulación de login SIN backend
const iniciarSesion = (e) => {
    e.preventDefault();
  
    // Validación simple simulada
    if (email === "medico@hospital.com" && contraseña === "123") {
  
      // Simulamos usuario válido
      const usuarioFake = {
        id_usuario: 1,
        nombre: "Juan"
      };
  
      onLogin(usuarioFake);
      setMensaje("");
  
    } else {
      setMensaje("Credenciales incorrectas o usuario inexistente");
    }
  };
 
  // Retornamos el JSX (interfaz)
  return (
    <div>

      {/* Título */}
      <h2>Login</h2>

      {/* Formulario que ejecuta iniciarSesion al enviarse */}
      <form onSubmit={iniciarSesion}>

        {/* Input para email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Actualiza el estado
        />

        {/* Input para contraseña */}
        <input
          type="password"
          placeholder="Contraseña"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)} // Actualiza el estado
        />

        {/* Botón para enviar el formulario */}
        <button type="submit">Ingresar</button>
      </form>

      {/* Si hay mensaje, lo mostramos en rojo */}
      {mensaje && <p style={{ color: "red" }}>{mensaje}</p>}
    </div>
  );
};

// Exportamos el componente para poder usarlo en App.js
export default Login;