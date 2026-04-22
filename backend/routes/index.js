const express = require("express");
const { validarCredenciales } = require("../controllers/authController");
const {
  consultarGuardiasAsignadas,
} = require("../controllers/guardiaController");
const {
  crearSolicitudDeCambio,
} = require("../controllers/solicitudController");

const router = express.Router();

router.post("/api/login", validarCredenciales);
router.post("/api/solicitudes", crearSolicitudDeCambio);
router.get("/api/guardias/:id_usuario", consultarGuardiasAsignadas);

module.exports = router;
