const db = require("../models/db");

/**
 * Obtener lista de especialidades de la base de datos
 */
async function obtenerEspecialidades(req, res) {
  try {
    const query = `
      SELECT id_especialidad, tipoEspecialidad AS descripcion
      FROM especialidad
    `;
    const [rows] = await db.query(query);
    
    return res.status(200).json({
      especialidades: rows
    });
  } catch (error) {
    console.error("❌ Error en obtenerEspecialidades:", error.message);
    return res.status(500).json({
      error: "Error interno del servidor al obtener las especialidades"
    });
  }
}

/**
 * Obtener lista de roles de la base de datos
 */
async function obtenerRoles(req, res) {
  try {
    const query = `
      SELECT id_rol, tipoRol AS nombre_rol
      FROM rol
    `;
    const [rows] = await db.query(query);
    
    return res.status(200).json({
      roles: rows
    });
  } catch (error) {
    console.error("❌ Error en obtenerRoles:", error.message);
    return res.status(500).json({
      error: "Error interno del servidor al obtener los roles"
    });
  }
}

module.exports = {
  obtenerEspecialidades,
  obtenerRoles
};
