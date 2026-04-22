const { usuarios, sesionesActivas } = require("../models/datos");

function siguienteIdSesion() {
  if (sesionesActivas.length === 0) return 1;
  return Math.max(...sesionesActivas.map((s) => s.id_sesion)) + 1;
}

function validarCredenciales(req, res) {
  const { email, contraseña } = req.body;

  const usuario = usuarios.find(
    (u) => u.email === email && u.contraseña === contraseña
  );

  if (!usuario) {
    return res.status(401).json({
      error: "Credenciales incorrectas o usuario inexistente",
    });
  }

  const id_sesion = siguienteIdSesion();
  const fecha_ingreso = new Date().toISOString();

  sesionesActivas.push({
    id_sesion,
    id_usuario: usuario.id_usuario,
    fecha_ingreso,
  });

  return res.status(200).json({
    mensaje: "Acceso habilitado",
    usuario: {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
    },
  });
}

module.exports = { validarCredenciales };
