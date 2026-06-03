const express = require("express");
const { validarCredenciales } = require("../controllers/authController");
const {
  consultarGuardiasAsignadas,
  asignarGuardiasAutomaticamente
} = require("../controllers/guardiaController");

const {
  configurarParametrosDistribucion
} = require("../controllers/calendarioController");

const {
  crearSolicitudDeCambio,
} = require("../controllers/solicitudController");

/**
 * Router principal de la API.
 *
 * Responsabilidades:
 * - Definir el contrato HTTP (método + path) de cada caso de uso expuesto.
 * - Delegar la lógica de negocio a los controladores (single responsibility).
 *
 * Nota:
 * - Se utiliza el prefijo `/api` para separar claramente endpoints de API de otras rutas del servidor.
 */
const router = express.Router();

// Autenticación: valida credenciales y devuelve datos mínimos del usuario.
router.post("/api/login", validarCredenciales);

// Solicitudes: registra una solicitud de cambio de guardia (alta).
router.post("/api/solicitudes", crearSolicitudDeCambio);

// Guardia: consulta guardias asignadas por id de usuario (lectura).
router.get("/api/guardias/:id_usuario", consultarGuardiasAsignadas);

// --- NUEVAS RUTAS: ASIGNACIÓN MASIVA DE GUARDIAS ---

// Configuración: recibe mes, año y reglas de distribución (Contrato 3).
router.post("/api/asignacion/configurar", configurarParametrosDistribucion);

// Generación: ejecuta el algoritmo de asignación automática (Contrato 4).
router.post("/api/asignacion/generar", asignarGuardiasAutomaticamente);

module.exports = router;