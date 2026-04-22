const { usuarios, sesionesActivas } = require("../models/datos");

/**
 * Genera el próximo identificador incremental de sesión.
 *
 * Motivo:
 * - En este proyecto se utiliza un almacenamiento en memoria (arrays) para simplificar el backend.
 * - Este helper asegura unicidad del `id_sesion` dentro del arreglo `sesionesActivas`.
 *
 * @returns {number} Próximo `id_sesion` disponible.
 */
function siguienteIdSesion() {
  if (sesionesActivas.length === 0) return 1;
  return Math.max(...sesionesActivas.map((s) => s.id_sesion)) + 1;
}

/**
 * Controlador: valida credenciales y habilita el acceso.
 *
 * Flujo esperado:
 * - Recibe `email` y `contraseña` por `req.body`.
 * - Busca coincidencia exacta en el origen de datos (en memoria).
 * - Si existe, registra una sesión "activa" y devuelve un payload mínimo de usuario.
 *
 * Respuestas:
 * - 200: Acceso habilitado y datos básicos del usuario.
 * - 401: Credenciales incorrectas o usuario inexistente.
 *
 * Nota de seguridad:
 * - La contraseña se compara en texto plano porque el modelo es didáctico/in-memory.
 *   En producción debe usarse hashing (p.ej. bcrypt) y almacenamiento persistente.
 *
 * @param {import("express").Request} req Request HTTP (body: { email, contraseña }).
 * @param {import("express").Response} res Response HTTP.
 * @returns {import("express").Response} Respuesta JSON con estado y payload.
 */
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

  // Persistencia en memoria: se registra la sesión para trazabilidad local del ejercicio.
  sesionesActivas.push({
    id_sesion,
    id_usuario: usuario.id_usuario,
    fecha_ingreso,
  });

  // Se devuelve información mínima para el frontend (evita exponer datos sensibles innecesarios).
  return res.status(200).json({
    mensaje: "Acceso habilitado",
    usuario: {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
    },
  });
}

module.exports = { validarCredenciales };
