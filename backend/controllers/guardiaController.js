const db = require("../models/db"); // Tu Singleton de conexión a MySQL
const MotorDeAsignacion = require('../estrategias/MotorDeAsignacion');
const AsignacionEquitativa = require('../estrategias/AsignacionEquitativa');

/**
 * Controlador: consulta guardias asignadas a un profesional.
 * Incluye el motivo de la solicitud si existe una solicitud pendiente.
 */
async function consultarGuardiasAsignadas(req, res) {
  try {
    const { id_usuario } = req.params;

    const [guardias] = await db.query(
      `
      SELECT 
        g.id_guardia,
        g.fecha,
        g.hora_inicio,
        g.hora_fin,
        g.estado,
        r.motivo  --  INCLUIMOS EL MOTIVO DESDE LA TABLA reemplazo
      FROM guardia g
      LEFT JOIN reemplazo r 
        ON g.id_guardia = r.id_guardia 
        AND r.estado = 'pendiente'  -- Solo trae el motivo si hay solicitud pendiente
      WHERE g.id_usuario = ?
      AND g.estado IN ('asignada','pendiente')
      ORDER BY g.fecha ASC
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
    console.error("Error al consultar guardias:", error);

    return res.status(500).json({
      error: "Error interno al consultar guardias",
    });
  }
}

async function previsualizarAsignacion(req, res) {

  try {

    const {
      mes,
      anio,
      id_especialidad,
      reglas = {}
    } = req.body;

    if (
      !mes ||
      !anio ||
      !id_especialidad
    ) {
      return res.status(400).json({
        error:
          "Faltan parámetros requeridos para la generación."
      });
    }

    const diasDelMes =
      new Date(
        anio,
        Number(mes),
        0
      ).getDate();

    const [profesionales] =
      await db.query(
        `
        SELECT
          id_usuario,
          nombre,
          apellido
        FROM usuario
        WHERE id_especialidad = ?
        `,
        [id_especialidad]
      );

    if (
      !profesionales ||
      profesionales.length < 2
    ) {
      return res.status(400).json({
        error:
          "No hay suficientes profesionales para generar las guardias"
      });
    }

    const motor =
      new MotorDeAsignacion(
        new AsignacionEquitativa()
      );

      const reglasFinal = {
        ...reglas,
        mes: Number(mes),
        anio: Number(anio),
      };

    const turnosGenerados =
      motor.ejecutar(
        profesionales,
        diasDelMes,
        reglasFinal
      );

    return res.status(200).json({

      borrador: true,

      turnos: turnosGenerados.map(
        (turno) => {

          const profesional =
            profesionales.find(
              p =>
                p.id_usuario ===
                turno.id_usuario
            );

          return {
            ...turno,

            nombreCompleto:
              profesional
                ? `${profesional.nombre} ${profesional.apellido}`
                : "Profesional desconocido",

                hora_inicio: reglas.horaInicio || req.body.horaInicio || "08:00",
                hora_fin: reglas.horaFin || req.body.horaFin || "20:00",

            estado:
              "BORRADOR"
          };
        }
      )
    });

  } catch (error) {

    console.error(
      "Error al previsualizar:",
      error
    );

    return res.status(500).json({
      error:
        "Error interno del servidor."
    });
  }
}

/**
 * Controlador: Asignar guardias automáticamente (Contrato 4).
 * Responsabilidades:
 * - Consultar profesionales disponibles por especialidad.
 * - Recuperar reglas configuradas por el administrador.
 * - Ejecutar el motor de asignación (Patrón Strategy).
 * - Persistir las guardias generadas.
 */
async function confirmarAsignacion(req, res) {

  let connection;

  try {

    const {
      mes,
      anio,
      id_especialidad,
      reglas,
      turnos,
      horaInicio,
      horaFin
    } = req.body;

    if (
      !mes ||
      !anio ||
      !id_especialidad ||
      !Array.isArray(turnos) || 
      turnos.length === 0
    ) {
      return res.status(400).json({
        error: "Faltan parámetros requeridos para la generación."
      });
    }

    

    connection = await db.getConnection();

    await connection.beginTransaction();

    // =====================================================
    // 1. VALIDAR DUPLICADOS
    // =====================================================

    const [existente] = await connection.query(
      `
      SELECT id_calendario
      FROM calendario
      WHERE mes = ?
      AND anio = ?
      `,
      [mes, anio]
    );

    if (existente.length > 0) {

      await connection.rollback();

      return res.status(400).json({
        error:
          "Ya existe un cronograma generado para ese mes y año."
      });
    }

    // =====================================================
    // 2. CREAR CALENDARIO
    // =====================================================

    const reglasString = JSON.stringify(reglas);

    const [resultCalendario] =
      await connection.query(
        `
        INSERT INTO calendario
        (
          mes,
          anio,
          estado,
          observaciones
        )
        VALUES
        (
          ?,
          ?,
          ?,
          ?
        )
        `,
        [
          mes,
          anio,
          "activo",
          reglasString
        ]
      );

    const id_calendario =
      resultCalendario.insertId;

    // =====================================================
    // 3. OBTENER PROFESIONALES
    // =====================================================

    const [profesionales] =
      await connection.query(
        `
        SELECT
          id_usuario,
          nombre,
          apellido
        FROM usuario
        WHERE id_especialidad = ?
        `,
        [id_especialidad]
      );

    if (
      !profesionales ||
      profesionales.length < 2
    ) {

      await connection.rollback();

      return res.status(400).json({
        error:
          "No hay suficientes profesionales para generar las guardias"
      });
    }

    

    // =====================================================
    // 5. INSERTAR GUARDIAS
    // =====================================================

    for (const turno of turnos) {

      const fecha =
        `${anio}-${String(mes).padStart(2, "0")}-${String(turno.dia).padStart(2, "0")}`;

      await connection.query(
        `
        INSERT INTO guardia
        (
          fecha,
          hora_inicio,
          hora_fin,
          estado,
          id_calendario,
          id_especialidad,
          id_usuario
        )
        VALUES
        (
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?
        )
        `,
        [
          fecha,
          `${horaInicio}:00`,
          `${horaFin}:00`,
          "asignada",
          id_calendario,
          id_especialidad,
          turno.id_usuario
        ]
      );
    }

    // =====================================================
    // 6. COMMIT
    // =====================================================

    await connection.commit();

    return res.status(200).json({
      mensaje:
        "Cronograma guardado correctamente.",
      id_calendario,
    });

  } catch (error) {

    if (connection) {
      await connection.rollback();
    }

    console.error(
      "❌ Error en asignarGuardiasAutomaticamente:",
      error
    );

    return res.status(500).json({
      error:
        "Error interno del servidor al generar las guardias."
    });

  } finally {

    if (connection) {
      connection.release();
    }

  }
}

module.exports = {
  consultarGuardiasAsignadas,
  previsualizarAsignacion,
  confirmarAsignacion
};