/**
 * "Base de datos" en memoria del proyecto.
 *
 * Motivo:
 * - Simplifica el backend evitando dependencia de un motor de BD durante el desarrollo del caso.
 * - Permite enfocarse en contratos HTTP y flujos del caso de uso.
 *
 * Consideraciones:
 * - El contenido se pierde al reiniciar el servidor (no persistente).
 * - En producción se reemplaza por una capa de acceso a datos (DAO/Repository) + BD real.
 */
const usuarios = [
  {
    id_usuario: 1,
    nombre: "Juan",
    apellido: "Pérez",
    email: "medico@hospital.com",
    contraseña: "123",
    id_rol: 2,
  },
];

// Guardias asignadas (dataset de ejemplo). `fecha` y `horario` se manejan como enteros para simplificar formato/orden.
let guardias = [
  { id_guardia: 1, fecha: 20260510, horario: 1400, id_usuario: 1, id_especialidad: 1, estado: "asignada" },
  { id_guardia: 2, fecha: 20260512, horario: 800, id_usuario: 1, id_especialidad: 1, estado: "asignada" },
  { id_guardia: 3, fecha: 20260515, horario: 2000, id_usuario: 1, id_especialidad: 1, estado: "asignada" }
];

// Solicitudes de reemplazo/cambio. Se completa vía `crearSolicitudDeCambio` y se guarda en memoria.
const reemplazos = [];

// Sesiones activas (registro simple) para el flujo de login del ejercicio.
const sesionesActivas = [];

module.exports = { usuarios, guardias, reemplazos, sesionesActivas };
