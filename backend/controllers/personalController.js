const db = require("../models/db"); // Asegúrate de que esta ruta apunte a tu conexión real
const bcrypt = require("bcryptjs"); 
/**
 * Obtiene la lista de profesionales (rol 2) junto con el nombre de su especialidad
 */
const obtenerPersonal = async (req, res) => {
  try {
    const query = `
      SELECT u.id_usuario, u.nombre, u.apellido, u.email, u.id_especialidad, u.id_rol, e.tipoEspecialidad, r.tipoRol AS rol
      FROM usuario u 
      INNER JOIN especialidad e ON u.id_especialidad = e.id_especialidad 
      INNER JOIN rol r ON u.id_rol = r.id_rol
      WHERE u.id_rol IN (2, 3) AND (u.activo = 1 OR u.activo IS NULL)
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

/**
 * Edita un profesional existente (baja lógica, o actualización de datos)
 */
const editarProfesional = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, contrasena, id_especialidad, id_rol } = req.body;

    const nombreLimpio = nombre?.trim();
    const apellidoLimpio = apellido?.trim();
    const emailLimpio = email?.trim();
    const idEspecialidad = Number(id_especialidad);
    const idRol = Number(id_rol);

    if (!nombreLimpio || !apellidoLimpio || !emailLimpio || !idEspecialidad || !idRol) {
      return res.status(400).json({ error: "Nombre, apellido, email, especialidad y rol son obligatorios." });
    }

    let query = `
      UPDATE usuario 
      SET nombre = ?, apellido = ?, email = ?, id_especialidad = ?, id_rol = ?
    `;
    let params = [nombreLimpio, apellidoLimpio, emailLimpio, idEspecialidad, idRol];

    // Si se envió una contraseña nueva, la actualizamos
    if (contrasena && contrasena.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(contrasena.trim(), salt);
      query += `, contrasena = ?`;
      params.push(hashPassword);
    }

    query += ` WHERE id_usuario = ?`;
    params.push(id);

    const [result] = await db.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Profesional no encontrado." });
    }

    res.status(200).json({ mensaje: "Profesional actualizado exitosamente." });
  } catch (error) {
    console.error("❌ Error en editarProfesional:", error.message);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: "El correo electrónico ya está en uso por otro usuario." });
    }
    res.status(500).json({ error: "Error interno al actualizar." });
  }
};

/**
 * Elimina un profesional de manera lógica (activo = 0)
 */
const eliminarProfesional = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `UPDATE usuario SET activo = 0 WHERE id_usuario = ?`;
    const [result] = await db.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Profesional no encontrado." });
    }

    res.status(200).json({ mensaje: "Profesional eliminado (baja lógica) exitosamente." });
  } catch (error) {
    console.error("❌ Error en eliminarProfesional:", error.message);
    res.status(500).json({ error: "Error interno al eliminar el profesional." });
  }
};

module.exports = {
  obtenerPersonal,
  crearProfesional,
  editarProfesional,
  eliminarProfesional
};