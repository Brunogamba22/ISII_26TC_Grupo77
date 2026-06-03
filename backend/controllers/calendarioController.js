const db = require("../models/db"); // Ajusta la ruta si tu db.js está en /config

/**
 * Controlador: Configurar parámetros de distribución (Contrato 3).
 * * Responsabilidad:
 * - Recibir del frontend el mes, año y las reglas de equidad.
 * - Crear el registro de planificación pertinente en la tabla 'calendario' con estado 'pendiente'.
 * Respuestas:
 * - 200: Éxito. Devuelve el ID del calendario generado.
 * - 500: Error interno en la consulta o conexión con la base de datos.
 */
async function configurarParametrosDistribucion(req, res) {
  try {
    const { mes, anio, reglasEquidad } = req.body;

    // Validación básica de campos requeridos
    if (!mes || !anio || !reglasEquidad) {
      return res.status(400).json({ error: "Los campos mes, anio y reglasEquidad son obligatorios." });
    }

    // Convertimos el objeto o array de reglas a un string JSON para guardarlo en el campo observaciones
    const reglasString = JSON.stringify(reglasEquidad);

    // Consulta SQL utilizando el pool de conexiones
    const query = `
      INSERT INTO calendario (mes, año, estado, observaciones) 
      VALUES (?, ?, ?, ?)
    `;
    
    const [result] = await db.query(query, [mes, anio, 'pendiente', reglasString]);

    // Respondemos al frontend con el ID auto-incremental generado por MySQL
    return res.status(200).json({
      mensaje: "Configuración de distribución guardada correctamente.",
      id_calendario: result.insertId
    });

  } catch (error) {
    console.error("❌ Error en configurarParametrosDistribucion:", error.message);
    return res.status(500).json({ 
      error: "Error interno del servidor al registrar los parámetros en la base de datos." 
    });
  }
}

module.exports = {
  configurarParametrosDistribucion
};