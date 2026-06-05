const db = require("../models/db"); // Asegúrate de que esta ruta apunte a tu conexión real

/**
 * Obtiene la lista de profesionales (rol 2) junto con el nombre de su especialidad
 */
const obtenerPersonal = async (req, res) => {
  try {
    const query = `
      SELECT u.id_usuario, u.nombre, u.apellido, u.email, e.tipoEspecialidad 
      FROM usuario u 
      INNER JOIN especialidad e ON u.id_especialidad = e.id_especialidad 
      WHERE u.id_rol = 2
    `;
    const [rows] = await db.query(query);
    
    res.status(200).json({ personal: rows });
  } catch (error) {
    console.error("❌ Error en obtenerPersonal:", error.message);
    res.status(500).json({ error: "Error interno al obtener el listado de personal." });
  }
};

/**
 * Crea un nuevo profesional en la base de datos
 */
const crearProfesional = async (req, res) => {
  try {
    const { nombre, apellido, email, contrasena, id_especialidad, id_rol } = req.body;

    // Validación de campos obligatorios
    if (!nombre || !apellido || !email || !contrasena || !id_especialidad || !id_rol) {
      return res.status(400).json({ error: "Todos los campos son obligatorios para registrar al profesional." });
    }

    // Inserción en la base de datos
    const query = `
      INSERT INTO usuario (nombre, apellido, email, contrasena, id_especialidad, id_rol) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [nombre, apellido, email, contrasena, id_especialidad, id_rol]);

    res.status(201).json({
      mensaje: "Profesional agregado exitosamente.",
      id_usuario: result.insertId
    });

  } catch (error) {
    console.error("❌ Error en crearProfesional:", error.message);
    
    // Capturar si el email ya existe (Violación de UNIQUE constraint en MySQL)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: "El correo electrónico ya se encuentra registrado." });
    }

    res.status(500).json({ error: "Error interno al registrar el profesional." });
  }
};

module.exports = {
  obtenerPersonal,
  crearProfesional
};