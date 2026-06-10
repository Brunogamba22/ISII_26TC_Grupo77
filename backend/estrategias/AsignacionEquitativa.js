/**
 * Estrategia Concreta: Asignación Equitativa
 * Garantiza la distribución equitativa de turnos y evita guardias consecutivas.
 *
 * CORRECCIÓN v2 (Bug T-07):
 *   Pipeline anterior:  FILTRAR consecutivas → SORT por FDS/total
 *   Pipeline corregido: SORT por FDS/total → FILTRAR consecutivas → fallback
 *
 *   Razón: el sort de equidad de FDS operaba solo sobre los ya filtrados,
 *   dejando fuera al profesional con menos FDS si era el bloqueado.
 *   Invirtiendo el orden, el criterio de equidad siempre tiene visibilidad
 *   sobre todos los profesionales antes de aplicar la restricción.
 */
class AsignacionEquitativa {

    asignarTurnos(profesionales, diasDelMes, reglas = {}) {

        const maxGuardiasConsecutivas =
            Number(reglas.maxGuardiasConsecutivas) || 1;

        if (!profesionales || profesionales.length < 2) {
            throw new Error(
                "No hay suficientes profesionales para generar las guardias."
            );
        }

        const conteoTurnos = {};
        const conteoFinDeSemana = {};

        profesionales.forEach((prof) => {
            conteoTurnos[prof.id_usuario] = 0;
            conteoFinDeSemana[prof.id_usuario] = 0;
        });

        const calendarioAsignado = [];
        const historialAsignaciones = [];

        for (let dia = 1; dia <= diasDelMes; dia++) {

            const diaSemana = new Date(
                reglas.anio,
                reglas.mes - 1,
                dia
            ).getDay();

            const esFinDeSemana = diaSemana === 0 || diaSemana === 6;

            // ─── PASO 1: Ordenar TODOS los profesionales por criterio de equidad ───
            // El sort opera sobre el universo completo ANTES de filtrar,
            // garantizando que el criterio de FDS tenga visibilidad total.
            const candidatosOrdenados = [...profesionales].sort((a, b) => {
                if (reglas.equidadFinesSemana && esFinDeSemana) {
                    const diffFDS =
                        conteoFinDeSemana[a.id_usuario] -
                        conteoFinDeSemana[b.id_usuario];

                    if (diffFDS !== 0) return diffFDS;
                }

                return (
                    conteoTurnos[a.id_usuario] -
                    conteoTurnos[b.id_usuario]
                );
            });

            // ─── PASO 2: Tomar el primer candidato que no viola la restricción ───
            // Recorremos en orden de prioridad (mejor candidato primero)
            // y elegimos el primero que no esté bloqueado por consecutivas.
            const ultimosAsignados =
                historialAsignaciones.slice(-maxGuardiasConsecutivas);

            let elegido = candidatosOrdenados.find(
                (prof) => !ultimosAsignados.includes(prof.id_usuario)
            );

            // ─── PASO 3: Fallback ─────────────────────────────────────────────────
            // Si todos están bloqueados (caso matemáticamente imposible con >= 2
            // profesionales y maxConsecutivas < totalProfesionales, pero lo
            // mantenemos por robustez), relajamos y tomamos el mejor candidato.
            if (!elegido) {
                elegido = candidatosOrdenados[0];
            }

            calendarioAsignado.push({
                dia,
                id_usuario: elegido.id_usuario,
                nombre_profesional:
                    `${elegido.nombre} ${elegido.apellido}`,
                hora_inicio: reglas.horaInicio || "08:00",
                hora_fin: reglas.horaFin || "20:00"
            });

            conteoTurnos[elegido.id_usuario]++;

            if (esFinDeSemana) {
                conteoFinDeSemana[elegido.id_usuario]++;
            }

            historialAsignaciones.push(elegido.id_usuario);
        }

        return calendarioAsignado;
    }
}

module.exports = AsignacionEquitativa;