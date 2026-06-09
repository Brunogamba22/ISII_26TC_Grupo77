const db = require("../models/db");

/**
 * Controlador Dashboard Profesional
 *
 * Responsabilidades:
 * - Obtener métricas principales del profesional.
 * - Mantener desacoplada la lógica del frontend.
 */
async function obtenerDashboardProfesional(req, res) {
  try {

    const { id_usuario } = req.params;

    /**
     * 1) TOTAL DE GUARDIAS ASIGNADAS
     */
    const [guardias] = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM guardia
      WHERE id_usuario = ?
      AND estado IN ('asignada', 'pendiente')
      `,
      [id_usuario]
    );

    /**
     * 2) SOLICITUDES PENDIENTES
     */
    const [solicitudes] = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM reemplazo
      WHERE solicitante_id = ?
      AND estado = 'pendiente'
      `,
      [id_usuario]
    );

    /**
     * 3) PRÓXIMA GUARDIA
     */
    const [proximaGuardia] = await db.query(
      `
      SELECT
        fecha,
        hora_inicio,
        hora_fin
      FROM guardia
      WHERE id_usuario = ?
      AND estado IN ('asignada', 'pendiente')
      AND fecha >= CURDATE()
      ORDER BY fecha ASC
      LIMIT 1
      `,
      [id_usuario]
    );

    return res.status(200).json({
      totalGuardias: guardias[0].total,
      solicitudesPendientes: solicitudes[0].total,
      proximaGuardia:
        proximaGuardia.length > 0
          ? proximaGuardia[0]
          : null,
    });

  } catch (error) {

    console.error(
      "Error dashboard profesional:",
      error
    );

    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
}

module.exports = {
  obtenerDashboardProfesional,
};