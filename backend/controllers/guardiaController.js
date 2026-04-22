const { guardias } = require("../models/datos");

/**
 * Controlador: consulta guardias asignadas a un profesional.
 *
 * Motivo:
 * - El frontend necesita listar únicamente las guardias del usuario autenticado.
 * - Se utiliza `id_usuario` como parámetro de ruta para expresar el recurso consultado.
 *
 * Respuestas:
 * - 200: Devuelve `{ guardias: [...] }` con las guardias encontradas.
 * - 404: No hay guardias asignadas para el usuario.
 *
 * @param {import("express").Request} req Request HTTP (params: { id_usuario }).
 * @param {import("express").Response} res Response HTTP.
 * @returns {import("express").Response} Respuesta JSON con guardias o mensaje de ausencia.
 */
function consultarGuardiasAsignadas(req, res) {
  const { id_usuario } = req.params;

  // Normaliza a número para evitar discrepancias string/number al comparar IDs.
  const guardiasAsignadas = guardias.filter(
    (g) => Number(g.id_usuario) === Number(id_usuario)
  );

  if (guardiasAsignadas.length === 0) {
    return res.status(404).json({ mensaje: "No hay guardias asignadas" });
  }

  return res.status(200).json({ guardias: guardiasAsignadas });
}

module.exports = { consultarGuardiasAsignadas };

