const db = require("../models/db");
const bcrypt = require("bcryptjs"); 
/**
 * Controlador: valida credenciales y devuelve el rol.
 *
 * Flujo:
 * - Recibe email y contraseña.
 * - Realiza un JOIN entre 'usuario' y 'rol'.
 * - Si es exitoso, devuelve los datos básicos y el ROL para el frontend.
 */
async function validarCredenciales(req, res) {

  try {

    const { email, contrasena } = req.body;

    // VALIDACIÓN
    if (!email || !contrasena) {

      return res.status(400).json({
        error: "Email y contraseña son obligatorios"
      });

    }

    // BUSCAR USUARIO POR EMAIL
    const query = `
      SELECT 
        u.id_usuario,
        u.nombre,
        u.apellido,
        u.email,
        u.contrasena,
        r.tipoRol AS rol
      FROM usuario u
      INNER JOIN rol r
        ON u.id_rol = r.id_rol
      WHERE u.email = ?
    `;

    const [rows] = await db.query(query, [email]);

    // SI NO EXISTE
    if (rows.length === 0) {

      return res.status(401).json({
        error: "Usuario inexistente"
      });

    }

    const usuario = rows[0];

    // COMPARAR PASSWORD CON BCRYPT
    const passwordValida = await bcrypt.compare(
      contrasena,
      usuario.contrasena
    );

    if (!passwordValida) {

      return res.status(401).json({
        error: "Contraseña incorrecta"
      });

    }

    // LOGIN OK
    return res.status(200).json({

      mensaje: "Acceso habilitado",

      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol
      }

    });

  } catch (error) {

    console.error(
      "❌ Error en validarCredenciales:",
      error.message
    );

    return res.status(500).json({
      error: "Error interno del servidor"
    });

  }

}

module.exports = {
  validarCredenciales
};