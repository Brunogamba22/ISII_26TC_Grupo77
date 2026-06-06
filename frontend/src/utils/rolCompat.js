const ALIAS_ROL = {
  administrador: "Administrador",
  admin: "Administrador",
  profesional: "Profesional",
  medico: "Profesional",
  médico: "Profesional",
};

export function normalizarRol(rol) {
  if (!rol) return null;
  const texto = String(rol).trim();
  if (texto === "Administrador" || texto === "Profesional") return texto;
  return ALIAS_ROL[texto.toLowerCase()] || texto;
}

export function rutaPorRol(rol) {
  const normalizado = normalizarRol(rol);
  if (normalizado === "Administrador") return "/admin/personal";
  if (normalizado === "Profesional") return "/medico";
  return null;
}
