const db = require("../models/db");

async function crearSolicitudDeCambio(req, res) {
  try {

    const {
      motivo,
      id_guardia,
      id_usuario,
    } = req.body;

    if (
      !motivo ||
      !id_guardia ||
      !id_usuario
    ) {
      return res.status(400).json({
        error: "Datos incompletos",
      });
    }

        // Verificar si ya existe una solicitud pendiente
    const [existente] = await db.query(
      `
      SELECT *
      FROM reemplazo
      WHERE id_guardia = ?
      AND estado = 'pendiente'
      `,
      [id_guardia]
    );

    if (existente.length > 0) {
      return res.status(400).json({
        error: "Ya existe una solicitud pendiente para esta guardia",
      });
    }


    await db.query(
  `
  INSERT INTO reemplazo
  (
    fecha_solicitud,
    motivo,
    estado,
    id_guardia,
    solicitante_id
  )
  VALUES
  (
    NOW(),
    ?,
    'pendiente',
    ?,
    ?
  )
  `,
  [
    motivo,
    id_guardia,
    id_usuario,
  ]
);

// CAMBIAR ESTADO DE LA GUARDIA
await db.query(
  `
  UPDATE guardia
  SET estado = 'pendiente'
  WHERE id_guardia = ?
  `,
  [id_guardia]
);

    return res.status(201).json({
      mensaje:
        "Solicitud registrada correctamente",
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error:
        "Error interno del servidor",
    });
  }
}

module.exports = {
  crearSolicitudDeCambio,
};