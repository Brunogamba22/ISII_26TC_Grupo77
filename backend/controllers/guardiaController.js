const { guardias } = require("../models/datos");

function consultarGuardiasAsignadas(req, res) {
  const { id_usuario } = req.params;

  const guardiasAsignadas = guardias.filter(
    (g) => Number(g.id_usuario) === Number(id_usuario)
  );

  if (guardiasAsignadas.length === 0) {
    return res.status(404).json({ mensaje: "No hay guardias asignadas" });
  }

  return res.status(200).json({ guardias: guardiasAsignadas });
}

module.exports = { consultarGuardiasAsignadas };

