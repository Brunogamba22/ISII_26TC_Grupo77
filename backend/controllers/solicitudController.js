const { guardias, reemplazos } = require("../models/datos");

function campoVacioONulo(valor) {
  return valor === null || valor === undefined || valor === "";
}

function siguienteIdReemplazo() {
  if (reemplazos.length === 0) return 1;
  return Math.max(...reemplazos.map((r) => r.id_reemplazo)) + 1;
}

function crearSolicitudDeCambio(req, res) {
  const { fecha, hora, motivo, id_guardia, id_usuario } = req.body;

  if (
    campoVacioONulo(fecha) ||
    campoVacioONulo(hora) ||
    campoVacioONulo(motivo) ||
    campoVacioONulo(id_guardia) ||
    campoVacioONulo(id_usuario)
  ) {
    return res.status(400).json({
      error: "Datos incompletos o fecha/turno inválido",
    });
  }

  const guardiaOcupadaPorOtro = guardias.some(
    (g) =>
      Number(g.fecha) === Number(fecha) &&
      Number(g.horario) === Number(hora) &&
      Number(g.id_usuario) !== Number(id_usuario) // Verifica si le pertenece a OTRO profesional
  );

  if (guardiaOcupadaPorOtro) {
    return res.status(409).json({
      error: "La fecha/hora seleccionada ya está ocupada. Seleccione otra fecha/hora.",
    });
  }

  const solicitud = {
    id_reemplazo: siguienteIdReemplazo(),
    fecha,
    hora,
    motivo,
    id_guardia: Number(id_guardia),
    solicitante: Number(id_usuario),
    estado: "pendiente",
  };

  reemplazos.push(solicitud);

  return res.status(201).json({
    mensaje: "Solicitud registrada correctamente",
    solicitud,
  });
}

module.exports = { crearSolicitudDeCambio };
