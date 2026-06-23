-- Procedimientos almacenados requeridos por la cátedra.
-- Mantiene el comportamiento original del sistema.

-- --------------------------------------------------
-- TAREA 2: PROCEDIMIENTO ALMACENADO DE CONSULTA (LECTURA)
-- --------------------------------------------------
DROP PROCEDURE IF EXISTS sp_consultar_guardias_asignadas;

DELIMITER //

CREATE PROCEDURE sp_consultar_guardias_asignadas(
    IN p_id_usuario INT
)
BEGIN
    SELECT 
        g.id_guardia,
        g.fecha,
        g.hora_inicio,
        g.hora_fin,
        g.estado,
        r.motivo
    FROM guardia g
    LEFT JOIN reemplazo r 
        ON g.id_guardia = r.id_guardia 
        AND r.estado = 'pendiente'
    WHERE g.id_usuario = p_id_usuario
    AND g.estado IN ('asignada','pendiente')
    ORDER BY g.fecha ASC;
END //

DELIMITER ;

-- --------------------------------------------------
-- TAREA 3: PROCEDIMIENTO ALMACENADO DE ESCRITURA (CREAR SOLICITUD DE CAMBIO)
-- --------------------------------------------------
DROP PROCEDURE IF EXISTS sp_crear_solicitud_cambio;

DELIMITER //

CREATE PROCEDURE sp_crear_solicitud_cambio(
    IN p_motivo VARCHAR(150),
    IN p_id_guardia INT,
    IN p_solicitante INT
)
BEGIN
    -- 1. Insertar en reemplazo.
    INSERT INTO reemplazo (
        fecha_solicitud,
        motivo,
        estado,
        id_guardia,
        solicitante_id
    )
    VALUES (
        NOW(),
        p_motivo,
        'pendiente',
        p_id_guardia,
        p_solicitante
    );

    -- 2. Actualizar guardia.estado='pendiente'.
    UPDATE guardia
    SET estado = 'pendiente'
    WHERE id_guardia = p_id_guardia;
END //

DELIMITER ;
