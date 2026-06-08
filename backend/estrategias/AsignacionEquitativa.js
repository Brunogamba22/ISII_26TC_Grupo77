/**
 * Estrategia Concreta: Asignación Equitativa
 * Garantiza la distribución equitativa de turnos y evita guardias consecutivas.
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

            const ultimosAsignados =
                historialAsignaciones.slice(
                    -maxGuardiasConsecutivas
                );

            let elegibles = profesionales.filter(
                (prof) =>
                    !ultimosAsignados.includes(prof.id_usuario)
            );

            // Si ninguna persona cumple la restricción,
            // relajamos la regla para evitar romper el algoritmo.
            if (elegibles.length === 0) {
                elegibles = [...profesionales];
            }

            const diaSemana = new Date(
                reglas.anio,
                reglas.mes - 1,
                dia
            ).getDay();
            
            const esFinDeSemana =
                diaSemana === 0 || diaSemana === 6;
            
            elegibles.sort((a, b) => {
                if (
                    reglas.equidadFinesSemana &&
                    esFinDeSemana
                ) {
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
            
            const elegido = elegibles[0];
            
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
            
            historialAsignaciones.push(
                elegido.id_usuario
            );
        }

        return calendarioAsignado;
    }
}

module.exports = AsignacionEquitativa;