const bcrypt = require("bcryptjs");

function esHashBcrypt(valor) {
  return (
    typeof valor === "string" &&
    /^\$2[aby]\$\d{2}\$/.test(valor)
  );
}

/**
 * Valida contraseña contra hash bcrypt o texto plano (datos legacy en BD).
 */
async function validarContrasena(ingresada, almacenada) {
  if (!almacenada) return false;

  if (esHashBcrypt(almacenada)) {
    return bcrypt.compare(ingresada, almacenada);
  }

  return ingresada === almacenada;
}

module.exports = { validarContrasena, esHashBcrypt };
