
const db = require("../models/db"); // Tu Singleton de conexión a MySQL
const MotorDeAsignacion = require('../estrategias/MotorDeAsignacion');
const AsignacionEquitativa = require('../estrategias/AsignacionEquitativa');

/**
 * Controlador: consulta guardias asignadas a un profesional.
 * (Sprint 1 - Datos simulados en memoria)
 */
async function consultarGuardiasAsignadas(req, res) {
  try {
    const { id_usuario } = req.params;

    const [guardias] = await db.query(
      `
      SELECT 
        id_guardia,
        fecha,
        hora_inicio,
        hora_fin,
        estado
      FROM guardia
      WHERE id_usuario = ?
      AND estado = 'asignada'
      ORDER BY fecha ASC
      `,
      [id_usuario]
    );

    if (guardias.length === 0) {
      return res.status(404).json({
        mensaje: "No hay guardias asignadas",
      });
    }

    return res.status(200).json({
      guardias,
    });

  } catch (error) {
    console.error(
      "Error al consultar guardias:",
      error
    );

    return res.status(500).json({
      error:
        "Error interno al consultar guardias",
    });
  }
}


/**
 * Controlador: Asignar guardias automáticamente (Contrato 4).
 * * Responsabilidades:
 * - Consultar profesionales disponibles por especialidad.
 * - Validar que existan suficientes profesionales.
 * - Ejecutar el motor de asignación (Patrón Estrategia).
 * - Guardar las guardias generadas en la base de datos.
 */
async function asignarGuardiasAutomaticamente(req, res) {
  try {
    // 1. Recibir los parámetros del body
    const { id_calendario, diasDelMes, id_especialidad, anio, mes } = req.body;

    // Validación básica de parámetros de entrada
    if (!id_calendario || !diasDelMes || !id_especialidad || !anio || !mes) {
        return res.status(400).json({ error: "Faltan parámetros requeridos para la generación." });
    }

    // 2. Obtener los médicos disponibles para esa especialidad
    const [profesionales] = await db.query(
      'SELECT id_usuario, nombre, apellido FROM usuario WHERE id_especialidad = ?',
      [id_especialidad]
    );

    // 3. Validación Crítica (Excepción del Contrato 4)
    if (!profesionales || profesionales.length < 2) {
      return res.status(400).json({ 
        error: "No hay suficientes profesionales para generar las guardias" 
      });
    }

    // 4. Instanciar el motor de asignación y ejecutar el algoritmo
    const motor = new MotorDeAsignacion(new AsignacionEquitativa());
    const turnosGenerados = motor.ejecutar(profesionales, diasDelMes);

    // VALIDAR DUPLICADOS
    const [guardiasExistentes] = await db.query(
      `SELECT * FROM guardia
      WHERE id_calendario = ?`,
      [id_calendario]
    );

    if (guardiasExistentes.length > 0) {
      return res.status(400).json({
        error: "Ya existen guardias generadas para este calendario."
      });
    }
    // 5. Iterar sobre los turnos generados y hacer el INSERT
    for (const turno of turnosGenerados) {
      // Formateamos mes y día para que siempre tengan 2 dígitos (ej: '05' en vez de '5')
      const mesFormateado = String(mes).padStart(2, '0');
      const diaFormateado = String(turno.dia).padStart(2, '0');
      
      // Armamos la fecha en formato YYYY-MM-DD exigido por MySQL
      const fecha = `${anio}-${mesFormateado}-${diaFormateado}`;
      
      const hora_inicio = '08:00:00';
      const hora_fin = '20:00:00';
      const estado = 'asignada';

      await db.query(
        `INSERT INTO guardia (fecha, hora_inicio, hora_fin, estado, id_calendario, id_especialidad, id_usuario) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [fecha, hora_inicio, hora_fin, estado, id_calendario, id_especialidad, turno.id_usuario]
      );
    }

    return res.status(200).json({
      mensaje: "Guardias generadas y asignadas exitosamente.",
      turnos: turnosGenerados.map((turno) => {
        const profesional = profesionales.find(
          (p) => p.id_usuario === turno.id_usuario
        );
    
        return {
          ...turno,
          nombreCompleto: profesional
            ? `${profesional.nombre} ${profesional.apellido}`
            : "Profesional desconocido",
          horario: "08:00 - 20:00",
          estado: "Asignada"
        };
      })
    });

  } catch (error) {
    console.error("❌ Error en asignarGuardiasAutomaticamente:", error.message);
    
    // Si el error provino directamente del lanzamiento dentro de la clase AsignacionEquitativa
    if (error.message.includes("No hay suficientes profesionales")) {
      return res.status(400).json({ 
        error: "No hay suficientes profesionales para generar las guardias" 
      });
    }

    return res.status(500).json({ 
      error: "Error interno del servidor al generar las guardias." 
    });
  }
}

// Exportamos ambos métodos para que el enrutador de la API pueda consumirlos
module.exports = {
  consultarGuardiasAsignadas,
  asignarGuardiasAutomaticamente
};