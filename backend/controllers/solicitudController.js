const db = require("../models/db");

/**
 * Valida que el motivo sea válido
 * @param {string} motivo - El motivo a validar
 * @returns {object} { isValid, errors }
 */
function validarMotivo(motivo) {
  const errors = [];
  
  // Validar que no esté vacío
  if (!motivo || motivo.trim().length === 0) {
    errors.push("El motivo es obligatorio");
    return { isValid: false, errors };
  }
  
  const motivoTrimmed = motivo.trim();
  const longitud = motivoTrimmed.length;
  
  // Validar longitud mínima
  if (longitud < 10) {
    errors.push("El motivo debe tener al menos 10 caracteres (actual: " + longitud + ")");
  }
  
  // Validar longitud máxima (150 caracteres según tu BD)
  if (longitud > 150) {
    errors.push("El motivo no puede exceder los 150 caracteres (actual: " + longitud + ")");
  }
  
  // Validar que no sean solo números
  if (/^\d+$/.test(motivoTrimmed)) {
    errors.push("El motivo no puede ser solo números, por favor describa el motivo");
  }
  
  // Validar que no sean solo caracteres especiales
  if (/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(motivoTrimmed)) {
    errors.push("El motivo debe incluir texto descriptivo, no solo caracteres especiales");
  }
  
  // Validar palabras mínimas (al menos 3 palabras)
  const palabras = motivoTrimmed.split(/\s+/).filter(p => p.length > 0);
  if (palabras.length < 3) {
    errors.push("Por favor, describa el motivo con al menos 3 palabras");
  }
  
  // Validar que no tenga caracteres prohibidos (opcional)
  const caracteresProhibidos = /[<>{}]/;
  if (caracteresProhibidos.test(motivoTrimmed)) {
    errors.push("El motivo contiene caracteres no permitidos (< > { })");
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors,
    cleanedMotivo: motivoTrimmed
  };
}

async function crearSolicitudDeCambio(req, res) {
  let connection;
  try {
    const {
      motivo,
      id_guardia,
      id_usuario,
    } = req.body;

    // Validación de campos requeridos
    if (!motivo || !id_guardia || !id_usuario) {
      return res.status(400).json({
        error: "Datos incompletos",
        details: {
          motivo: !motivo ? "El motivo es requerido" : null,
          id_guardia: !id_guardia ? "ID de guardia requerido" : null,
          id_usuario: !id_usuario ? "ID de usuario requerido" : null
        }
      });
    }

    // VALIDACIÓN DEL MOTIVO
    const validacion = validarMotivo(motivo);
    
    if (!validacion.isValid) {
      return res.status(400).json({
        error: "El motivo ingresado no es válido",
        details: {
          errors: validacion.errors,
          suggestion: "Por favor, proporcione una descripción clara del motivo del cambio (mínimo 10 caracteres, al menos 3 palabras)"
        }
      });
    }

    // Verificar si ya existe una solicitud pendiente
    const [existente] = await db.query(
      `
      SELECT *
      FROM reemplazo
      WHERE id_guardia = ?
      AND estado = 'pendiente'
      `,
      [id_guardia]
    );

    if (existente.length > 0) {
      return res.status(400).json({
        error: "Ya existe una solicitud pendiente para esta guardia",
        suggestion: "Puede cancelar la solicitud actual antes de crear una nueva"
      });
    }

    // Verificar que la guardia existe y está asignada al usuario
    const [guardiaValida] = await db.query(
      `
      SELECT id_guardia, estado
      FROM guardia
      WHERE id_guardia = ? AND id_usuario = ?
      `,
      [id_guardia, id_usuario]
    );

    if (guardiaValida.length === 0) {
      return res.status(404).json({
        error: "La guardia no existe o no le pertenece"
      });
    }

    if (guardiaValida[0].estado === 'pendiente') {
      return res.status(400).json({
        error: "Esta guardia ya tiene una solicitud pendiente"
      });
    }

    // Iniciar transacción (ACID) para inserción y actualización
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Procedimiento almacenado requerido por la cátedra.
    // Mantiene el comportamiento original del sistema.
    await connection.query(
      `CALL sp_crear_solicitud_cambio(?, ?, ?)`,
      [
        validacion.cleanedMotivo,  // Usamos el motivo limpiado
        id_guardia,
        id_usuario
      ]
    );

    // Confirmar transacción
    await connection.commit();

    return res.status(201).json({
      mensaje: "Solicitud registrada correctamente",
      detalles: {
        id_guardia: id_guardia,
        motivo: validacion.cleanedMotivo
      }
    });

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error al crear solicitud:", error);
    
    // Manejo de errores específicos de MySQL
    if (error.code === 'ER_DATA_TOO_LONG') {
      return res.status(400).json({
        error: "El motivo es demasiado largo",
        suggestion: "El motivo no puede exceder los 150 caracteres"
      });
    }
    
    if (error.code === 'ER_BAD_FIELD_ERROR') {
      return res.status(500).json({
        error: "Error en la estructura de la base de datos"
      });
    }
    
    return res.status(500).json({
      error: "Error interno del servidor. Por favor, intente nuevamente más tarde"
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

/**
 * Cancela una solicitud pendiente.
 *
 * Responsabilidades:
 * - eliminar reemplazo pendiente
 * - restaurar estado guardia
 */
async function cancelarSolicitud(req, res) {
  try {
    const { id_guardia } = req.params;

    if (!id_guardia) {
      return res.status(400).json({
        error: "ID de guardia no proporcionado"
      });
    }

    // Verificar que existe una solicitud pendiente antes de cancelar
    const [solicitudExistente] = await db.query(
      `
      SELECT id_reemplazo, estado
      FROM reemplazo
      WHERE id_guardia = ? AND estado = 'pendiente'
      `,
      [id_guardia]
    );

    if (solicitudExistente.length === 0) {
      return res.status(404).json({
        error: "No existe una solicitud pendiente para esta guardia"
      });
    }

    /**
     * Eliminamos solicitud pendiente.
     */
    await db.query(
      `
      DELETE FROM reemplazo
      WHERE id_guardia = ?
      AND estado = 'pendiente'
      `,
      [id_guardia]
    );

    /**
     * Restauramos guardia.
     */
    await db.query(
      `
      UPDATE guardia
      SET estado = 'asignada'
      WHERE id_guardia = ?
      `,
      [id_guardia]
    );

    return res.status(200).json({
      mensaje: "Solicitud cancelada correctamente",
      detalles: {
        id_guardia: id_guardia,
        estado_anterior: "pendiente",
        estado_actual: "asignada"
      }
    });

  } catch (error) {
    console.error("Error al cancelar solicitud:", error);
    
    return res.status(500).json({
      error: "Error interno del servidor",
      suggestion: "Por favor, intente nuevamente más tarde"
    });
  }
}

module.exports = {
  crearSolicitudDeCambio,
  cancelarSolicitud
};