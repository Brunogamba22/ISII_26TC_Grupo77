const db = require("../models/db"); // Tu conexión a MySQL

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

    // Validación básica
    if (!email || !contrasena) {
      return res.status(400).json({ error: "Email y contraseña son obligatorios" });
    }

    // Consulta SQL con JOIN a la tabla 'rol'
    const query = `
      SELECT u.id_usuario, u.nombre, u.apellido, u.email, r.tipoRol AS rol
      FROM usuario u
      INNER JOIN rol r ON u.id_rol = r.id_rol
      WHERE u.email = ? AND u.contraseña = ?
    `;
    
    const [rows] = await db.query(query, [email, contrasena]);

    if (rows.length === 0) {
      return res.status(401).json({
        error: "Credenciales incorrectas o usuario inexistente",
      });
    }

    const usuario = rows[0];

    // Se devuelve la información incluyendo el rol exacto
    return res.status(200).json({
      mensaje: "Acceso habilitado",
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol // Ej: 'Administrador' o 'Profesional'
      },
    });

  } catch (error) {
    console.error("❌ Error en validarCredenciales:", error.message);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

module.exports = { validarCredenciales };