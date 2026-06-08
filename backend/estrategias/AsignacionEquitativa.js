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

        profesionales.forEach((prof) => {
            conteoTurnos[prof.id_usuario] = 0;
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

            elegibles.sort(
                (a, b) =>
                    conteoTurnos[a.id_usuario] -
                    conteoTurnos[b.id_usuario]
            );

            const elegido = elegibles[0];

            calendarioAsignado.push({
                dia,
                id_usuario: elegido.id_usuario,
                nombre_profesional:
                    `${elegido.nombre} ${elegido.apellido}`
            });

            conteoTurnos[elegido.id_usuario]++;

            historialAsignaciones.push(
                elegido.id_usuario
            );
        }

        return calendarioAsignado;
    }
}

module.exports = AsignacionEquitativa;