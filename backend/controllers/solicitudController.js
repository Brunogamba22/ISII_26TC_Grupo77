const { guardias, reemplazos } = require("../models/datos");

/**
 * Valida si un campo requerido está vacío o no fue provisto.
 *
 * Motivo:
 * - Centraliza la validación de campos para mantener el controlador legible.
 * - Evita duplicar checks de `null/undefined/""` en cada endpoint.
 *
 * @param {*} valor Valor a validar.
 * @returns {boolean} `true` si el valor es nulo, indefinido o string vacío.
 */
function campoVacioONulo(valor) {
  return valor === null || valor === undefined || valor === "";
}

/**
 * Genera el próximo identificador incremental de reemplazo.
 *
 * Motivo:
 * - Este backend trabaja con arreglos en memoria como persistencia simplificada.
 * - Se requiere un `id_reemplazo` único para poder referenciar la solicitud creada.
 *
 * @returns {number} Próximo `id_reemplazo` disponible.
 */
function siguienteIdReemplazo() {
  if (reemplazos.length === 0) return 1;
  return Math.max(...reemplazos.map((r) => r.id_reemplazo)) + 1;
}

/**
 * Controlador: crea una solicitud de cambio de guardia.
 *
 * Flujo esperado:
 * - Valida datos mínimos requeridos del formulario (fecha, hora, motivo, id_guardia, id_usuario).
 * - Verifica conflicto: que la fecha/hora no esté ocupada por otro profesional.
 * - Registra la solicitud en estado `pendiente` y la devuelve al cliente.
 *
 * Respuestas:
 * - 201: Solicitud registrada correctamente (incluye el objeto `solicitud`).
 * - 400: Datos incompletos o inválidos.
 * - 409: Conflicto por ocupación de fecha/hora por otro profesional.
 *
 * @param {import("express").Request} req Request HTTP (body: { fecha, hora, motivo, id_guardia, id_usuario }).
 * @param {import("express").Response} res Response HTTP.
 * @returns {import("express").Response} Respuesta JSON con mensaje y/o detalles del error.
 */
function crearSolicitudDeCambio(req, res) {
  const { fecha, hora, motivo, id_guardia, id_usuario } = req.body;

  // Validación de contrato: evita registrar solicitudes incompletas.
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

  // Previene solapamientos: no se permite elegir un turno ya tomado por otra persona.
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

  // Estructura de la entidad "solicitud de reemplazo" en el almacenamiento en memoria.
  const solicitud = {
    id_reemplazo: siguienteIdReemplazo(),
    fecha,
    hora,
    motivo,
    id_guardia: Number(id_guardia),
    solicitante: Number(id_usuario),
    estado: "pendiente",
  };

  // Persistencia en memoria (para el alcance del ejercicio).
  reemplazos.push(solicitud);

  return res.status(201).json({
    mensaje: "Solicitud registrada correctamente",
    solicitud,
  });
}

module.exports = { crearSolicitudDeCambio };
