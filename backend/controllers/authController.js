const db = require("../models/db");
const { sesionesActivas } = require("../models/datos");
const { normalizarRol } = require("../utils/rolCompat");
const { validarContrasena } = require("../utils/passwordCompat");
const { logPaso } = require("../utils/trazabilidadAuth");

/**
 * Controlador: valida credenciales y devuelve el rol.
 * Trazabilidad: Caso de Uso "Iniciar Sesión" — Contrato de Operación 2 (Tabla 12).
 *
 * Flujo:
 * - Recibe email y contraseña.
 * - Realiza un JOIN entre 'usuario' y 'rol'.
 * - Registra sesión activa y devuelve datos + rol normalizado al frontend.
 */
async function validarCredenciales(req, res) {
  const emailSolicitado = req.body?.email;

  try {
    logPaso("INICIO", { email: emailSolicitado });

    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
      logPaso("VALIDACION_FALLIDA", { motivo: "campos_vacios" });
      return res.status(400).json({
        error: "Email y contraseña son obligatorios",
      });
    }

    logPaso("BUSCAR_USUARIO", { email });

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

    const [rows] = await db.query(query, [email.trim()]);

    if (rows.length === 0) {
      logPaso("USUARIO_NO_ENCONTRADO", { email });
      return res.status(401).json({
        error: "Usuario inexistente",
      });
    }

    const usuario = rows[0];
    const passwordValida = await validarContrasena(
      contrasena,
      usuario.contrasena
    );

    if (!passwordValida) {
      logPaso("CONTRASENA_INVALIDA", {
        id_usuario: usuario.id_usuario,
        email,
      });
      return res.status(401).json({
        error: "Contraseña incorrecta",
      });
    }

    const rol = normalizarRol(usuario.rol);

    const sesion = {
      id_sesion: sesionesActivas.length + 1,
      id_usuario: usuario.id_usuario,
      email: usuario.email,
      rol,
      inicio: new Date().toISOString(),
    };
    sesionesActivas.push(sesion);

    logPaso("LOGIN_OK", {
      id_usuario: usuario.id_usuario,
      rol,
      id_sesion: sesion.id_sesion,
    });

    return res.status(200).json({
      mensaje: "Acceso habilitado",
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol,
      },
      trazabilidad: {
        casoUso: "Iniciar Sesión",
        contrato: "validarCredenciales",
        id_sesion: sesion.id_sesion,
      },
    });
  } catch (error) {
    logPaso("ERROR_INTERNO", { mensaje: error.message });
    console.error("❌ Error en validarCredenciales:", error.message);
    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
}

module.exports = {
  validarCredenciales,
};
