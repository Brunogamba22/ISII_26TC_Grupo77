/**
 * Logs estructurados para el caso de uso "Iniciar Sesión" (CU / Contrato 2).
 */
function logPaso(paso, detalle = {}) {
  console.log(
    `[AUTH][${new Date().toISOString()}] ${paso}`,
    Object.keys(detalle).length ? detalle : ""
  );
}

module.exports = { logPaso };
