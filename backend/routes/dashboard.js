const express = require("express");

const {
  obtenerDashboardProfesional
} = require("../controllers/dashboardController");

const router = express.Router();

/**
 * Dashboard del profesional.
 * Devuelve:
 * - total de guardias asignadas
 * - solicitudes pendientes
 * - próxima guardia
 */
router.get(
  "/dashboard/:id_usuario",
  obtenerDashboardProfesional
);

module.exports = router;