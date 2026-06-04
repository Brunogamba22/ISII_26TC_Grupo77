/**
 * Normaliza el nombre de rol devuelto por MySQL al valor esperado por el frontend.
 * Trazabilidad: contrato de operación 2 → campo `rol` en la respuesta de login.
 */
const ROLES_FRONTEND = ["Administrador", "Profesional"];

const ALIAS_ROL = {
  administrador: "Administrador",
  admin: "Administrador",
  profesional: "Profesional",
  medico: "Profesional",
  médico: "Profesional",
  doctor: "Profesional",
};

function normalizarRol(rolDb) {
  if (!rolDb) return null;

  const texto = String(rolDb).trim();
  if (ROLES_FRONTEND.includes(texto)) return texto;

  const alias = ALIAS_ROL[texto.toLowerCase()];
  return alias || texto;
}

module.exports = { normalizarRol, ROLES_FRONTEND };
