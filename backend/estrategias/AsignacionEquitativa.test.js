/**
 * ============================================================
 * SUITE DE PRUEBAS UNITARIAS — BLOQUE 1
 * Clase: AsignacionEquitativa (Patrón Strategy — Estrategia Concreta)
 * Proyecto: MediGuard Pro — Sistema de Gestión de Guardias Médicas
 * Runner: Jest (CommonJS)
 *
 * TRAZABILIDAD:
 *   - Contrato: previsualizarCronograma / confirmarCronograma
 *   - Curso Normal:      Tabla 8 (2.1 Conversación Principal)
 *   - Cursos Alternativos: 4.1.1 (sin suficientes profesionales)
 * ============================================================
 */

const AsignacionEquitativa = require("./AsignacionEquitativa");

// ─── Fixtures reutilizables ──────────────────────────────────────────────────

/**
 * Genera un array de N profesionales con IDs únicos.
 * Mantiene los tests independientes de datos reales de DB.
 */
const crearProfesionales = (cantidad) =>
    Array.from({ length: cantidad }, (_, i) => ({
        id_usuario: i + 1,
        nombre: `Profesional`,
        apellido: `${i + 1}`,
    }));

/**
 * Reglas base para un mes conocido.
 * Usamos febrero 2025 (28 días, sin leap year) para que
 * los fines de semana sean predecibles y los tests, deterministas.
 */
const REGLAS_BASE = {
    mes: 2,
    anio: 2025,
    horaInicio: "08:00",
    horaFin: "20:00",
    maxGuardiasConsecutivas: 1,
    equidadFinesSemana: false,
};

const DIAS_FEBRERO = 28;

// ─── Instancia bajo prueba ───────────────────────────────────────────────────

let estrategia;

beforeEach(() => {
    estrategia = new AsignacionEquitativa();
});

// ============================================================
// GRUPO 1 — Validación de Pre-condiciones (Cursos Alternativos)
// Trazabilidad: Contrato previsualizarCronograma > Excepciones
//               "Si no existen suficientes profesionales..."
// ============================================================

describe("Validación de Pre-condiciones — Cursos Alternativos", () => {

    // T-01: array vacío
    test("T-01 | Lanza error cuando el array de profesionales está vacío", () => {
        expect(() =>
            estrategia.asignarTurnos([], DIAS_FEBRERO, REGLAS_BASE)
        ).toThrow("No hay suficientes profesionales para generar las guardias.");
    });

    // T-02: un solo profesional
    test("T-02 | Lanza error cuando hay exactamente 1 profesional", () => {
        const profesionales = crearProfesionales(1);

        expect(() =>
            estrategia.asignarTurnos(profesionales, DIAS_FEBRERO, REGLAS_BASE)
        ).toThrow("No hay suficientes profesionales para generar las guardias.");
    });

    // T-02b: null (caso defensivo)
    test("T-02b | Lanza error cuando profesionales es null", () => {
        expect(() =>
            estrategia.asignarTurnos(null, DIAS_FEBRERO, REGLAS_BASE)
        ).toThrow("No hay suficientes profesionales para generar las guardias.");
    });

});

// ============================================================
// GRUPO 2 — Estructura del Resultado (Curso Normal)
// Trazabilidad: Post-condiciones de previsualizarCronograma
//               "Se crearon múltiples instancias de Guardia en memoria..."
// ============================================================

describe("Estructura del resultado — Curso Normal", () => {

    // T-03: cantidad de entradas == días del mes
    test("T-03 | Retorna exactamente 28 entradas para febrero de 2025", () => {
        const profesionales = crearProfesionales(3);

        const resultado = estrategia.asignarTurnos(
            profesionales,
            DIAS_FEBRERO,
            REGLAS_BASE
        );

        expect(resultado).toHaveLength(DIAS_FEBRERO);
    });

    // T-04: cada entrada tiene los campos del contrato de operación
    test("T-04 | Cada entrada posee los campos requeridos por el contrato", () => {
        const profesionales = crearProfesionales(3);

        const resultado = estrategia.asignarTurnos(
            profesionales,
            DIAS_FEBRERO,
            REGLAS_BASE
        );

        resultado.forEach((entrada, index) => {
            // El campo 'dia' debe ser un número del 1 al 28
            expect(entrada).toHaveProperty("dia", index + 1);

            // id_usuario debe ser un número válido del set de profesionales
            expect(entrada).toHaveProperty("id_usuario");
            expect(typeof entrada.id_usuario).toBe("number");

            // nombre_profesional debe ser un string no vacío
            expect(entrada).toHaveProperty("nombre_profesional");
            expect(typeof entrada.nombre_profesional).toBe("string");
            expect(entrada.nombre_profesional.trim().length).toBeGreaterThan(0);

            // Horas de inicio y fin
            expect(entrada).toHaveProperty("hora_inicio", "08:00");
            expect(entrada).toHaveProperty("hora_fin", "20:00");
        });
    });

    // T-08: valores por defecto cuando NO se pasan horas en las reglas
    test("T-08 | Usa '08:00' y '20:00' como horas por defecto si no se especifican", () => {
        const profesionales = crearProfesionales(2);

        // Reglas SIN horaInicio ni horaFin
        const reglasSinHoras = { mes: 2, anio: 2025, maxGuardiasConsecutivas: 1 };

        const resultado = estrategia.asignarTurnos(
            profesionales,
            DIAS_FEBRERO,
            reglasSinHoras
        );

        expect(resultado[0].hora_inicio).toBe("08:00");
        expect(resultado[0].hora_fin).toBe("20:00");
    });

});

// ============================================================
// GRUPO 3 — Distribución Equitativa (Core de la Lógica)
// Trazabilidad: Contrato 3 > "ejecutar el motor de asignación
//               mediante la estrategia equitativa"
// ============================================================

describe("Distribución equitativa de turnos — Lógica de negocio", () => {

    // T-05: la diferencia de turnos entre cualquier par de profesionales es ≤ 1
    test("T-05 | La diferencia de guardias entre profesionales no supera 1", () => {
        const profesionales = crearProfesionales(4);

        const resultado = estrategia.asignarTurnos(
            profesionales,
            DIAS_FEBRERO,
            REGLAS_BASE
        );

        // Contamos cuántos turnos recibió cada profesional
        const conteo = {};
        profesionales.forEach((p) => (conteo[p.id_usuario] = 0));
        resultado.forEach((entrada) => conteo[entrada.id_usuario]++);

        const valores = Object.values(conteo);
        const max = Math.max(...valores);
        const min = Math.min(...valores);

        expect(max - min).toBeLessThanOrEqual(1);
    });

    // T-06: nadie trabaja dos días seguidos con maxGuardiasConsecutivas = 1
    test("T-06 | Ningún profesional tiene guardias consecutivas (maxConsecutivas = 1)", () => {
        const profesionales = crearProfesionales(3);

        const resultado = estrategia.asignarTurnos(
            profesionales,
            DIAS_FEBRERO,
            { ...REGLAS_BASE, maxGuardiasConsecutivas: 1 }
        );

        for (let i = 1; i < resultado.length; i++) {
            const diaAnterior = resultado[i - 1].id_usuario;
            const diaActual = resultado[i].id_usuario;

            expect(diaActual).not.toBe(diaAnterior);
        }
    });

    // T-09: con maxGuardiasConsecutivas = 2, un profesional puede aparecer
    //        dos veces seguidas pero no tres
    test("T-09 | Respeta maxGuardiasConsecutivas = 2 (nunca 3 seguidas)", () => {
        // Necesitamos más profesionales para que el algoritmo tenga margen
        const profesionales = crearProfesionales(4);

        const resultado = estrategia.asignarTurnos(
            profesionales,
            DIAS_FEBRERO,
            { ...REGLAS_BASE, maxGuardiasConsecutivas: 2 }
        );

        // Detectar racha máxima de un mismo profesional
        let rachaActual = 1;

        for (let i = 1; i < resultado.length; i++) {
            if (resultado[i].id_usuario === resultado[i - 1].id_usuario) {
                rachaActual++;
            } else {
                rachaActual = 1;
            }

            expect(rachaActual).toBeLessThanOrEqual(2);
        }
    });

});

// ============================================================
// GRUPO 4 — Equidad en Fines de Semana
// Trazabilidad: Regla de negocio "distribución equitativa de
//               fines de semana" del formulario de configuración
// ============================================================

describe("Equidad en fines de semana", () => {

    /**
     * Helper: cuenta cuántos FDS le tocaron a cada profesional
     */
    const contarFinesDeSemana = (resultado, anio, mes) => {
        const conteo = {};

        resultado.forEach((entrada) => {
            const diaSemana = new Date(anio, mes - 1, entrada.dia).getDay();
            const esFinDeSemana = diaSemana === 0 || diaSemana === 6;

            if (esFinDeSemana) {
                conteo[entrada.id_usuario] = (conteo[entrada.id_usuario] || 0) + 1;
            }
        });

        return conteo;
    };

    // T-07: con equidadFinesSemana = true, la diferencia de FDS es ≤ 1
    test("T-07 | Con equidadFinesSemana activo, la diferencia de FDS entre profesionales es ≤ 1", () => {
        const profesionales = crearProfesionales(3);

        const resultado = estrategia.asignarTurnos(
            profesionales,
            DIAS_FEBRERO,
            { ...REGLAS_BASE, equidadFinesSemana: true }
        );

        const conteoFDS = contarFinesDeSemana(resultado, 2025, 2);

        // Incluimos a profesionales que no recibieron ningún FDS (conteo = 0)
        // de forma explícita, sin mezclar el literal 0 en el spread de valores.
        const valoresPorProfesional = profesionales.map(
            (p) => conteoFDS[p.id_usuario] ?? 0
        );

        const max = Math.max(...valoresPorProfesional);
        const min = Math.min(...valoresPorProfesional);

        expect(max - min).toBeLessThanOrEqual(1);
    });

    // T-07b: sin el flag, el orden de FDS NO está garantizado
    //         (test de comportamiento diferenciado)
    test("T-07b | Sin equidadFinesSemana, el algoritmo prioriza solo el total de guardias", () => {
        const profesionales = crearProfesionales(2);

        // Solo verificamos que NO lanza error y retorna el largo correcto.
        // No hacemos aserciones sobre equidad de FDS porque el flag está apagado.
        const resultado = estrategia.asignarTurnos(
            profesionales,
            DIAS_FEBRERO,
            { ...REGLAS_BASE, equidadFinesSemana: false }
        );

        expect(resultado).toHaveLength(DIAS_FEBRERO);
    });

});

// ============================================================
// GRUPO 5 — Edge Cases y Robustez
// Trazabilidad: "Relaja la regla para evitar romper el algoritmo"
//               (comentario explícito en el código fuente)
// ============================================================

describe("Edge cases — Robustez del algoritmo", () => {

    // T-10: con exactamente 2 profesionales y maxConsecutivas = 1,
    //        el algoritmo NUNCA se queda sin elegibles porque siempre
    //        hay uno disponible. Verificamos que no rompe.
    test("T-10 | Con 2 profesionales no rompe aunque la ventana sea ajustada", () => {
        const profesionales = crearProfesionales(2);

        expect(() => {
            const resultado = estrategia.asignarTurnos(
                profesionales,
                DIAS_FEBRERO,
                REGLAS_BASE
            );
            // Debe retornar todos los días
            expect(resultado).toHaveLength(DIAS_FEBRERO);
        }).not.toThrow();
    });

    // T-10b: con maxConsecutivas MUY alto (igual a la cantidad de profesionales),
    //         el algoritmo relaja la regla y sigue generando el calendario completo.
    test("T-10b | Relaja la restricción de consecutivas cuando no hay elegibles disponibles", () => {
        // Con 2 profesionales y maxConsecutivas = 2,
        // después del día 2 el historial contiene [1,2] y ninguno es elegible.
        // El algoritmo debe relajar y continuar.
        const profesionales = crearProfesionales(2);

        let resultado;
        expect(() => {
            resultado = estrategia.asignarTurnos(
                profesionales,
                DIAS_FEBRERO,
                { ...REGLAS_BASE, maxGuardiasConsecutivas: 2 }
            );
        }).not.toThrow();

        expect(resultado).toHaveLength(DIAS_FEBRERO);
    });

    // T-11: mes de 31 días (enero) genera 31 entradas
    test("T-11 | Genera correctamente un mes de 31 días", () => {
        const profesionales = crearProfesionales(3);

        const resultado = estrategia.asignarTurnos(
            profesionales,
            31,
            { ...REGLAS_BASE, mes: 1, anio: 2025 }
        );

        expect(resultado).toHaveLength(31);
        // El último día registrado debe ser el día 31
        expect(resultado[30].dia).toBe(31);
    });

    // T-12: nombre_profesional combina correctamente nombre y apellido
    test("T-12 | El campo nombre_profesional concatena nombre y apellido correctamente", () => {
        const profesionales = [
            { id_usuario: 1, nombre: "Ana", apellido: "García" },
            { id_usuario: 2, nombre: "Luis", apellido: "Pérez" },
        ];

        const resultado = estrategia.asignarTurnos(
            profesionales,
            DIAS_FEBRERO,
            REGLAS_BASE
        );

        const nombresValidos = ["Ana García", "Luis Pérez"];

        resultado.forEach((entrada) => {
            expect(nombresValidos).toContain(entrada.nombre_profesional);
        });
    });

});