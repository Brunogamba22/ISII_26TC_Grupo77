const express = require("express");
const { validarCredenciales } = require("../controllers/authController");
const {
  consultarGuardiasAsignadas,
  previsualizarAsignacion,
  confirmarAsignacion
} = require("../controllers/guardiaController");



const {
  crearSolicitudDeCambio,
  cancelarSolicitud
} = require("../controllers/solicitudController");

const {
  obtenerPersonal,
  crearProfesional,
  editarProfesional,
  eliminarProfesional
} = require("../controllers/personalController");

const {
  obtenerEspecialidades,
  obtenerRoles
} = require("../controllers/catalogosController");

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
router.put(
  "/api/solicitudes/cancelar/:id_guardia",
  cancelarSolicitud
);


// Guardia: consulta guardias asignadas por id de usuario (lectura).
router.get("/api/guardias/:id_usuario", consultarGuardiasAsignadas);

// --- NUEVAS RUTAS: ASIGNACIÓN MASIVA DE GUARDIAS ---

router.post("/api/asignacion/previsualizar", previsualizarAsignacion);

router.post("/api/asignacion/confirmar", confirmarAsignacion);

// --- RUTAS DE GESTIÓN DE PERSONAL (ADMINISTRADOR) ---

// Obtener lista de profesionales con su especialidad
router.get("/api/personal", obtenerPersonal);

// Crear un nuevo profesional (médico)
router.post("/api/registro", crearProfesional);

// Editar un profesional existente
router.put("/api/personal/:id", editarProfesional);

// Eliminar un profesional (baja lógica)
router.delete("/api/personal/:id", eliminarProfesional);

// --- RUTAS DE CATÁLOGOS ---

// Obtener todas las especialidades
router.get("/api/especialidades", obtenerEspecialidades);

// Obtener todos los roles
router.get("/api/roles", obtenerRoles);

module.exports = router;