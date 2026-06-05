const db = require("../models/db"); // Asegúrate de que esta ruta apunte a tu conexión real
const bcrypt = require("bcryptjs"); 
/**
 * Obtiene la lista de profesionales (rol 2) junto con el nombre de su especialidad
 */
const obtenerPersonal = async (req, res) => {
  try {
    const query = `
      SELECT u.id_usuario, u.nombre, u.apellido, u.email, e.tipoEspecialidad, r.tipoRol AS rol
      FROM usuario u 
      INNER JOIN especialidad e ON u.id_especialidad = e.id_especialidad 
      INNER JOIN rol r ON u.id_rol = r.id_rol
      WHERE u.id_rol IN (2, 3)
      ORDER BY u.id_usuario
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

    const nombreLimpio = nombre?.trim();
    const apellidoLimpio = apellido?.trim();
    const emailLimpio = email?.trim();
    const idEspecialidad = Number(id_especialidad);
    const idRol = Number(id_rol);

    if (!nombreLimpio || !apellidoLimpio || !emailLimpio || !contrasena || !idEspecialidad || !idRol) {
      return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(contrasena, salt);

    const query = `
      INSERT INTO usuario (nombre, apellido, email, contrasena, id_especialidad, id_rol) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      nombreLimpio,
      apellidoLimpio,
      emailLimpio,
      hashPassword,
      idEspecialidad,
      idRol
    ]);

    res.status(201).json({
      mensaje: "Profesional agregado exitosamente.",
      id_usuario: result.insertId
    });

  } catch (error) {
    console.error("❌ Error en crearProfesional:", error.message);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: "El correo electrónico ya existe." });
    }
    res.status(500).json({ error: "Error interno al registrar." });
  }
};

module.exports = {
  obtenerPersonal,
  crearProfesional
};